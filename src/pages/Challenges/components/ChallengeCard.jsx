import React from 'react';
import { challengeProblemsAPI } from '../../../apis/challengeProblems';
import { deleteChallengeFile } from '../../../utils/fileUpload';

const ChallengeCard = ({ 
  item, 
  isFolder = false, 
  onSelect, 
  onEdit, 
  onDelete,
  canEdit,
  canDelete
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(item);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(item);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
    if (!isFolder) {
        for (var file in item.files) {
            deleteChallengeFile(item.files[file].filePath)
        }
    }
  };

  return (
    <div 
      className="card border border-gray-400 shadow-md bg-base-100 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isFolder ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
            <h2 className="card-title text-base">{item.title}</h2>
            {!isFolder && item.isSolved && (
              <span className="ml-2 badge badge-success" title="Solved">
                ✔
              </span>
            )}
          </div>
          
          <div className="flex gap-1">
            {canEdit && (
              <button 
                className="btn btn-xs btn-ghost btn-circle" 
                onClick={handleEdit}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            {canDelete && (
              <button 
                className="btn btn-xs btn-ghost btn-circle text-error" 
                onClick={handleDelete}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <p className="text-sm text-base-content/70 truncate mt-1">
          {item.description || 'No description provided'}
        </p>
        
        {!isFolder && (
          <div className="flex items-center justify-between mt-2">
            <div className="badge badge-accent badge-sm">
              {item.category.name || 'Uncategorized'}
            </div>
            <div className="font-semibold text-sm">
              XP: {item.xp || 0}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
