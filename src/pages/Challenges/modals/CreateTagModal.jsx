import React, { useState, useEffect } from 'react';

const CreateTagModal = ({ isOpen, onClose, onSave, tag = null, loading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    if (tag) {
      setName(tag.name || '');
      setDescription(tag.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [tag, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    if (tag) {
      // Update existing tag
      onSave({
        id: tag.id,
        name: name.trim(),
        description: description.trim()
      });
    } else {
      // Create new tag
      onSave({
        name: name.trim(),
        description: description.trim()
      });
    }
  };

  return (
    <dialog id="create_tag_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{tag ? 'Edit Tag' : 'Create New Tag'}</h3>
        <div className="py-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Tag Name</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter tag name" 
              className="input input-bordered w-full" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Description (optional)</span>
            </label>
            <textarea 
              placeholder="Enter description" 
              className="textarea textarea-bordered h-24" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (tag ? 'Update' : 'Create')}
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
