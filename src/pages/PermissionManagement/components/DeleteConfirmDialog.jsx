import React from 'react';

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-2">{title || 'Confirm Deletion'}</h3>
        <p className="mb-4 text-base-content/80">{message || 'Are you sure you want to delete this item?'}</p>
        
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
