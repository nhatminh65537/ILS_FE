import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTag } from '../../../store/modulesSlice';

const CreateTagModal = ({ isOpen, onClose, loading }) => {
  const dispatch = useDispatch();
  const [newTagName, setNewTagName] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    
    dispatch(createTag({
      name: newTagName.trim(),
      description: newTagDescription.trim() || ""
    }));
    
    setNewTagName('');
    setNewTagDescription('');
    onClose();
  };

  return (
    <dialog id="create_tag_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Create New Tag</h3>
        <div className="py-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Tag Name</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter tag name" 
              className="input input-bordered w-full" 
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Description (optional)</span>
            </label>
            <textarea 
              placeholder="Enter description" 
              className="textarea textarea-bordered h-24" 
              value={newTagDescription}
              onChange={(e) => setNewTagDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="modal-action">
          <button 
            className="btn" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleCreateTag}
            disabled={!newTagName.trim() || loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : 'Create Tag'}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default CreateTagModal;
