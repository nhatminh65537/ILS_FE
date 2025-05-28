import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFinishedLessonsForModule } from '../../../../store/contentEditSlice';

const ModuleContentTree = ({ contentTree, moduleId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [expandedFolders, setExpandedFolders] = useState({});
  const finishedLessonIds = useSelector(state => state.contentEdit.finishedLessonIds || []);
  const loading = useSelector(state => state.contentEdit.loading);
  
  // Enhanced fetch for finished lessons with error handling
  useEffect(() => {
    if (moduleId) {
      try {
        dispatch(fetchFinishedLessonsForModule(moduleId));
      } catch (error) {
        console.error("Error fetching finished lessons:", error);
        // Optionally show an error toast or message
      }
    }
  }, [moduleId, dispatch]);
  
  const toggleFolder = (folderId, event) => {
    if (event) event.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  const renderTreeItem = (node) => {
    if (!node?.item) return null;
    
    const item = node.item;
    const isLesson = !!item.lesson;
    const isFolder = !isLesson;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedFolders[item.id];
    const isFinished = isLesson && finishedLessonIds.includes(item.lesson.id);
    
    return (
      <div key={item.id} className="pl-4 border-l border-base-200">
        <div 
          className="flex items-center py-1 hover:bg-base-200 rounded-md px-2 cursor-pointer"
          onClick={() => {
            if (isLesson) {
              navigate(`/learn/${moduleId}/lessons/${item.lesson.id}`);
            } else if (isFolder) {
              toggleFolder(item.id);
            }
          }}
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
          
          {isLesson ? (
            <div className="flex items-center">
              {isFinished ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 font-semibold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          )}
          
          <span className={isFinished ? 'text-green-600 font-semibold bg-success/10 px-1 rounded' : ''}>
            {item.lesson?.title || item.title}
          </span>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {node.children.map(child => renderTreeItem(child))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="overflow-y-auto">
      {contentTree?.children?.map(node => renderTreeItem(node))}
    </div>
  );
};

export default ModuleContentTree;
