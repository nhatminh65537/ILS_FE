import React from 'react';

const DeleteConfirmDialog = ({ isOpen, onConfirm, onCancel, itemType, itemName }) => {
  const getItemTypeDisplay = (type) => {
    switch(type) {
      case 'module': return 'Module';
      case 'folder': return 'Folder';
      case 'lesson': return 'Lesson';
      default: return 'Item';
    }
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Delete</h3>
        <p className="py-4">
          Are you sure you want to delete this {getItemTypeDisplay(itemType)}
          {itemName ? `: "${itemName}"` : ''}?
        </p>
        <p className="text-warning">This action cannot be undone.</p>
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>close</button>
      </form>
    </dialog>
  );
};

export default DeleteConfirmDialog;
