import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemType, itemName, loading }) => {
  return (
    <dialog id="delete_confirm_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Delete {itemType}</h3>
        <div className="py-4">
          <p>Are you sure you want to delete the {itemType.toLowerCase()} "{itemName}"?</p>
          <p className="text-warning mt-2">This action cannot be undone.</p>
        </div>
        <div className="modal-action">
          <button 
            className="btn" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn btn-error" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : `Delete ${itemType}`}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default DeleteConfirmModal;
