import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFinishedLessonsForModule } from '../../../../store/contentEditSlice';

const LessonContentTree = ({ contentTree, activeNodeId, onSelectLesson }) => {
  const [expandedFolders, setExpandedFolders] = useState({});
  const dispatch = useDispatch();
  const finishedLessonIds = useSelector(state => state.contentEdit.finishedLessonIds || []);
  const { currentModule } = useSelector(state => state.contentEdit);
  
  // Fetch finished lessons when the component mounts or module changes
  useEffect(() => {
    if (currentModule?.id) {
      dispatch(fetchFinishedLessonsForModule(currentModule.id));
    }
  }, [dispatch, currentModule?.id]);
  
  // Auto-expand folders containing active node
  useEffect(() => {
    if (activeNodeId && contentTree) {
      const expandFolderPathToNode = (tree, nodeId, path = []) => {
        if (!tree) return false;
        
        if (tree.item && tree.item.id === nodeId) {
          return path;
        }
        
        if (tree.children && tree.children.length > 0) {
          for (const child of tree.children) {
            const foundPath = expandFolderPathToNode(child, nodeId, [...path, tree.item?.id]);
            if (foundPath) return foundPath;
          }
        }
        
        return false;
      };
      
      const path = expandFolderPathToNode(contentTree, activeNodeId);
      if (path) {
        const newExpandedFolders = { ...expandedFolders };
        path.forEach(folderId => {
          if (folderId) newExpandedFolders[folderId] = true;
        });
        setExpandedFolders(newExpandedFolders);
      }
    }
  }, [activeNodeId, contentTree]);
  
  const toggleFolder = (folderId, event) => {
    event.stopPropagation();
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };
  
  const renderTreeItem = (node) => {
    if (!node?.item) return null;
    
    const item = node.item;
    const isLesson = !!item.lesson;
    const isModule = !item.title && !isLesson;
    const isFolder = !isModule && !isLesson;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedFolders[item.id];
    const isActive = activeNodeId === item.id;
    const isFinished = isLesson && finishedLessonIds.includes(item.lesson.id);
    
    return (
      <div key={item.id} className="pl-4 border-l border-base-300">
        <div 
          className={`flex items-center py-1 hover:bg-base-200 rounded-md px-2 cursor-pointer 
            ${isActive ? 'bg-base-200 font-bold' : ''}`}
          onClick={() => isLesson && onSelectLesson(item.id, item.lesson.id)}
        >
          {hasChildren && (
            <button
              className="btn btn-xs btn-ghost mr-1"
              onClick={(e) => toggleFolder(item.id, e)}
            >
              {isExpanded ? "−" : "+"}
            </button>
          )}
          {!hasChildren && <span className="w-5 mr-1"></span>}
          
          {isModule && <span className="mr-2">📘</span>}
          {isLesson && (
            <span className="mr-2">
              {isFinished ? 
                <span className="text-green-600 font-semibold">✓📝</span> :
                <span>📝</span>
              }
            </span>
          )}
          {isFolder && <span className="mr-2">📁</span>}
          
          <span className={isFinished ? 'text-green-600 font-semibold bg-success/10 px-1 rounded' : ''}>
            {item.module?.title || item.lesson?.title || item.title}
          </span>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {node.children.map((child) => renderTreeItem(child))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="p-4">
      <div className="font-bold mb-2 p-2 bg-base-200 rounded">
        Module Content
      </div>
      
      {contentTree && (
        <div className="cursor-pointer flex items-center p-2 hover:bg-base-200 rounded-md mb-4">
          <span className="mr-2">📘</span>
          <span className="font-semibold">{contentTree.item?.title || 'Module'}</span>
        </div>
      )}
      
      <div className="overflow-y-auto">
        {contentTree?.children?.map((node) => renderTreeItem(node))}
      </div>
    </div>
  );
};

export default LessonContentTree;
