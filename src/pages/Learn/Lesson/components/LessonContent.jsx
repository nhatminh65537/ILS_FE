import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS for math rendering

const LessonContent = ({ lesson, node, onFinish, isCompleted }) => {
  const [readTime, setReadTime] = useState(0);
  const [isFinishable, setIsFinishable] = useState(false);

  const finishedLessonIds = useSelector(state => state.contentEdit.finishedLessonIds || []);
  
  // Start timer when content is loaded
  useEffect(() => {
    if (lesson && lesson.content) {
      const timer = setInterval(() => {
        setReadTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [lesson]);
  
  // Determine if lesson can be marked as finished
  useEffect(() => {
    // For now, enable finish button after 10 seconds of reading time
    // Later this can be more sophisticated based on content length
    if (readTime >= 10 || isCompleted) {
      setIsFinishable(true);
    }
  }, [readTime, isCompleted]);
  
  if (!lesson) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      
      {lesson.lessonType && (
        <div className="badge badge-primary mb-4">
          {lesson.lessonType.name}
        </div>
      )}
      
      <div className="flex gap-2 mb-6 text-sm text-base-content/70">
        {lesson.duration && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {lesson.duration} min
          </div>
        )}
        
        {lesson.xp && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {lesson.xp} XP
          </div>
        )}
      </div>
      
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[[rehypeKatex, { strict: false }]]}
        >{lesson.content.replace(/\\\\/g, '\\') || 'No content available for this lesson.'}</ReactMarkdown>
      </div>
      
      <div className="mt-8 border-t pt-4 flex justify-end">
        <button 
          className={`btn ${isCompleted ? 'btn-success' : isFinishable ? 'btn-primary' : 'btn-disabled'}`}
          onClick={onFinish}
          disabled={!isFinishable || isCompleted}
        >
          {isCompleted || finishedLessonIds.includes(lesson.id) ? 'Completed!' : 'Mark as Completed'}
        </button>
      </div>
    </div>
  );
};

export default LessonContent;
