import React from 'react';

const EditHeader = ({ title, onSave, onExit, hasUnsavedChanges, disabled = false }) => {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <span className="btn btn-ghost normal-case text-xl">ILSNX</span>
      </div>
      <div className="navbar-center">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div className="navbar-end gap-2">
        <button 
          className="btn btn-primary" 
          onClick={onSave} 
          disabled={!hasUnsavedChanges || disabled}
        >
          {hasUnsavedChanges && <span className="badge badge-xs badge-warning"></span>}
          Save
        </button>
        <button className="btn" onClick={onExit} disabled={disabled}>
          Exit
        </button>
      </div>
    </div>
  );
};

export default EditHeader;
