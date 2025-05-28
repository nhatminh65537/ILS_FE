import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTag } from '../../../store/modulesSlice';

const DeleteTagModal = ({ isOpen, onClose, tag, loading }) => {
  const dispatch = useDispatch();

  const handleDeleteTag = async () => {
    if (!tag) return;
    
    const result = await dispatch(deleteTag(tag.id));
    
    if (result.meta.requestStatus === 'fulfilled') {
      onClose();
    }
  };

  return (
    <dialog id="delete_tag_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Delete Tag</h3>
        <div className="py-4">
          <p>Are you sure you want to delete the tag "{tag?.name}"?</p>
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
            onClick={handleDeleteTag}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : 'Delete Tag'}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default DeleteTagModal;
