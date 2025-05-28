import React from 'react';

const UnsavedChangesDialog = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Unsaved Changes</h3>
        <p className="py-4">
          You have unsaved changes. Do you want to discard these changes and continue?
        </p>
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-warning" onClick={onConfirm}>
            Discard Changes
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default UnsavedChangesDialog;
