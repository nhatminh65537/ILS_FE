import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModuleContent } from '../../../store/contentEditSlice';
import { getModuleProgressById, updateModuleProgress, fetchModuleProgress } from '../../../store/myUserSlice';
import ModuleProgressBar from '../../../components/ModuleCard/ModuleProgressBar';
import ModuleContentTree from './components/ModuleContentTree';
import { learnProgressStatesAPI, PROGRESS_STATES } from '../../../apis/learnProgressStates';

const ModuleView = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentModule, contentTree, loading, error } = useSelector(state => state.contentEdit);
  const moduleProgress = useSelector(state => getModuleProgressById(state, moduleId));
  const finishedLessonIds = useSelector(state => state.contentEdit.finishedLessonIds || []);
  const [progressStates, setProgressStates] = useState([]);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  
  useEffect(() => {
    dispatch(fetchModuleContent(moduleId));
    dispatch(fetchModuleProgress());
    
    // Fetch progress states
    learnProgressStatesAPI.getAllProgressStates()
      .then(states => setProgressStates(states))
      .catch(err => console.error("Failed to load progress states", err));
  }, [dispatch, moduleId]);
  
  // Function to find the first lesson in the content tree
  const findFirstLesson = (tree) => {
    if (!tree) return null;
    
    // Check direct children first
    if (tree.children && tree.children.length > 0) {
      for (const child of tree.children) {
        if (child.item && child.item.lesson && !finishedLessonIds.includes(child.item.lesson.id)) {
          return child.item;
        }
        const foundLesson = findFirstLesson(child);
        if (foundLesson) return foundLesson;
      }
    }
    
    return null;
  };
  
  // Update progress state and then navigate to the first lesson
  const handleStartLearning = async () => {
    const firstLesson = findFirstLesson(contentTree);
    if (!firstLesson || !firstLesson.lesson) return;
    
    try {
      setUpdatingProgress(true);
      
      // Set module to "Learning" state if it's not already completed
      if (!moduleProgress || moduleProgress.progressState?.name !== PROGRESS_STATES.COMPLETED) {
        // Find the Learning state
        const learningState = await learnProgressStatesAPI.findProgressStateByName(
          PROGRESS_STATES.LEARNING,
          progressStates
        );
        
        if (learningState) {
          await dispatch(updateModuleProgress({
            moduleId: parseInt(moduleId),
            progressStateId: learningState.id
          }));
        }
      }
      
      // Navigate to the first lesson
      navigate(`/learn/${moduleId}/lessons/${firstLesson.lesson.id}`);
    } catch (err) {
      console.error("Error updating module progress", err);
    } finally {
      setUpdatingProgress(false);
    }
  };
  
  // Determine button text based on progress state
  const getButtonText = () => {
    if (!moduleProgress || !moduleProgress.progressState) {
      return "Start Learning";
    }
    
    const stateName = moduleProgress.progressState.name;
    
    if (stateName === PROGRESS_STATES.COMPLETED) {
      return "Review";
    } else if (stateName === PROGRESS_STATES.LEARNING) {
      return "Continue";
    }
    
    return "Start Learning";
  };
  
  if (loading && !currentModule) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }
  
  if (!currentModule) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="alert alert-warning">
          <span>Module not found</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumbs for navigation */}
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li><Link to="/learn">Modules</Link></li>
          <li>{currentModule.title}</li>
        </ul>
      </div>
      
      <div className="card bg-base-100 shadow-xl mb-8">
        <figure className="relative">
          {currentModule.imagePath ? (
            <img 
              src={currentModule.imagePath} 
              alt={currentModule.title} 
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-base-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          {currentModule.lifecycleState && (
            <div className="absolute top-2 right-2">
              <div className="badge badge-primary">{currentModule.lifecycleState.name}</div>
            </div>
          )}
        </figure>
        
        <div className="card-body">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="card-title text-3xl mb-2">{currentModule.title}</h1>
              
              <div className="flex flex-wrap gap-2 my-3">
                {currentModule.category && (
                  <div className="badge badge-outline">{currentModule.category.name}</div>
                )}
                {currentModule.tags && currentModule.tags.map(tag => (
                  <div key={tag.id} className="badge badge-secondary badge-outline">{tag.name}</div>
                ))}
              </div>
              
              <div className="stats stats-horizontal bg-base-200 shadow-sm my-4 text-sm">
                {(
                  <div className="stat">
                    <div className="stat-title">Duration</div>
                    <div className="stat-value text-2xl">{currentModule.duration}</div>
                    <div className="stat-desc">minutes</div>
                  </div>
                )}
                {(
                  <div className="stat">
                    <div className="stat-title">Experience</div>
                    <div className="stat-value text-2xl">{currentModule.xp}</div>
                    <div className="stat-desc">XP points</div>
                  </div>
                )}
              </div>
              
              {/* Add progress bar if there's module progress */}
              {moduleProgress && (
                <div className="my-4">
                  <h3 className="text-sm font-medium mb-1">Your Progress</h3>
                  <ModuleProgressBar progress={moduleProgress.progressPercentage} />
                </div>
              )}
            </div>
            
            <div className="md:self-center">
              <button 
                className="btn btn-primary btn-lg gap-2" 
                onClick={handleStartLearning}
                disabled={!contentTree || !findFirstLesson(contentTree) || updatingProgress}
              >
                {updatingProgress ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Loading
                  </>
                ) : (
                  <>
                    {getButtonText()}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="divider"></div>
          
          <div className="prose max-w-none">
            <p>{currentModule.description}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-base-100 rounded-box shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Module Content</h2>
        
        {contentTree && contentTree.children && contentTree.children.length > 0 ? (
          <ModuleContentTree 
            contentTree={contentTree}
            moduleId={moduleId}
          />
        ) : (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>This module doesn't have any content yet.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleView;
