import React from 'react';

const ModuleProgressBar = ({ progress = 0, className = "" }) => {
  // Ensure progress is between 0-100
  const safeProgress = Math.max(0, Math.min(100, progress));
  
  // Determine color based on progress
  let progressColor = 'progress-primary';
  if (safeProgress >= 100) {
    progressColor = 'progress-success';
  } else if (safeProgress >= 50) {
    progressColor = 'progress-info';
  }

  return (
    <div className={`w-full ${className}`}>
      <progress 
        className={`progress ${progressColor} w-full`} 
        value={safeProgress} 
        max="100"
      ></progress>
      <div className="text-xs text-center mt-1">{Math.round(safeProgress)}% complete</div>
    </div>
  );
};

export default ModuleProgressBar;
