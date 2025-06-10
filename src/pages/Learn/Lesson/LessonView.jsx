import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchModuleContent, 
  fetchLessonContent,
  findNodeById,
  markLessonFinished
} from '../../../store/contentEditSlice';
import LessonHeader from './components/LessonHeader';
import LessonContentTree from './components/LessonContentTree';
import LessonContent from './components/LessonContent';

const LessonView = () => {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { contentTree, loading, error, currentModule, lessons } = useSelector(state => state.contentEdit);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  // Fetch module content on mount
  useEffect(() => {
    dispatch(fetchModuleContent(moduleId));
  }, [dispatch, moduleId]);
  
  // If lessonId is provided, set it as active and fetch its content
  useEffect(() => {
    if (contentTree && lessonId) {
      // Find the node that contains this lesson
      const findLessonNode = (tree) => {
        if (!tree) return null;
        
        if (tree.item && tree.item.lesson && tree.item.lesson.id === Number(lessonId)) {
          return tree.item.id;
        }
        
        if (tree.children && tree.children.length > 0) {
          for (const child of tree.children) {
            const found = findLessonNode(child);
            if (found) return found;
          }
        }
        
        return null;
      };
      
      const nodeId = findLessonNode(contentTree);
      if (nodeId) {
        setActiveNodeId(nodeId);
        if (!lessons[lessonId]) {
          dispatch(fetchLessonContent({ lessonId: Number(lessonId), isEditMode: false }));
        }
      }
    }
  }, [contentTree, lessonId, dispatch, lessons]);
  
  const handleLessonSelect = (nodeId, lessonId) => {
    setActiveNodeId(nodeId);
    if (lessonId && !lessons[lessonId]) {
      dispatch(fetchLessonContent({ lessonId: Number(lessonId), isEditMode: false }));
    }
    navigate(`/learn/${moduleId}/lessons/${lessonId}`);
  };
  
  const handleLessonFinish = async () => {
    try {
      // Mark lesson as finished via Redux action
      await dispatch(markLessonFinished({ 
        lessonId: Number(lessonId), 
        moduleId: Number(moduleId) 
      }));
      
      // Update local state for immediate UI feedback
      setLessonCompleted(true);
      
      // Show success toast notification
      const toast = document.createElement('div');
      toast.className = 'toast toast-end';
      toast.innerHTML = `
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Lesson completed!</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
      
    } catch (error) {
      console.error('Error marking lesson as finished:', error);
      
      // Show error toast notification
      const toast = document.createElement('div');
      toast.className = 'toast toast-end';
      toast.innerHTML = `
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to mark lesson as completed</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    }
  };
  
  if (loading && !contentTree) {
    return (
      <div className="flex flex-col min-h-screen">
        <LessonHeader title="Loading..." moduleId={moduleId} />
        <div className="flex flex-grow justify-center items-center mt-16">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <LessonHeader title="Error" moduleId={moduleId} />
        <div className="flex flex-grow justify-center items-center mt-16">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }
  
  const activeNode = activeNodeId ? findNodeById(contentTree, activeNodeId) : null;
  const activeLessonId = activeNode?.item?.lesson?.id;
  const activeLessonData = activeLessonId ? lessons[activeLessonId] : null;
  
  return (
    <div className="flex flex-col min-h-screen">
      <LessonHeader 
        title={currentModule?.title || 'Lesson'} 
        moduleId={moduleId}
        lessonTitle={activeLessonData?.title} 
      />
      
      <div className="flex flex-grow overflow-hidden mt-16">
        {/* Left Sidebar */}
        <div className="w-75 w-min-75 border-r bg-base-100 overflow-y-auto">
          <LessonContentTree 
            contentTree={contentTree} 
            activeNodeId={activeNodeId}
            onSelectLesson={handleLessonSelect}
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto p-4">
          {activeNode && activeLessonData ? (
            <LessonContent 
              lesson={activeLessonData}
              node={activeNode}
              onFinish={handleLessonFinish}
              isCompleted={lessonCompleted}
            />
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-base-content/70">Select a lesson from the sidebar to view its content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonView;
