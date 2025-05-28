import React from 'react';
import { useNavigate } from 'react-router-dom';

const LessonHeader = ({ title, moduleId, lessonTitle }) => {
  const navigate = useNavigate();

  const handleExitLesson = () => {
    navigate(`/learn/${moduleId}`);
  };

  return (
    <div className="navbar bg-base-200 text-base-content fixed top-0 z-50 shadow-md">
      <div className="navbar-start">
        <button 
          className="btn btn-ghost"
          onClick={handleExitLesson}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
      
      <div className="navbar-center text-center">
        <div className="flex flex-col">
          <span className="text-xl font-bold">{title || 'Module'}</span>
          {lessonTitle && <span className="text-sm opacity-70">{lessonTitle}</span>}
        </div>
      </div>
      
      {/* <div className="navbar-end">
        <button 
          className="btn btn-primary"
          onClick={handleExitLesson}
        >
          Back to Module
        </button>
      </div> */}
    </div>
  );
};

export default LessonHeader;
