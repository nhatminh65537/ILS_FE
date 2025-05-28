import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTag } from '../../../store/modulesSlice';

const TagInfoModal = ({ 
  isOpen, 
  onClose, 
  tag,
  setTag,
  canUpdate, 
  loading 
}) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTag, setEditedTag] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState(null);
  
  // Initialize form when tag changes
  useEffect(() => {
    if (tag) {
      setEditedTag({
        name: tag.name || '',
        description: tag.description || ''
      });
    }
  }, [tag]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Reset form to original values
    if (tag) {
      setEditedTag({
        name: tag.name || '',
        description: tag.description || ''
      });
    }
  };
  
  const handleSave = () => {
    if (!editedTag.name.trim()) {
      setError('Tag name cannot be empty');
      return;
    }
    
    dispatch(updateTag({
      id: tag.id,
      name: editedTag.name.trim(),
      description: editedTag.description.trim() || null
    }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        setError(null);
        setTag({...tag, ...editedTag});    
      })
      .catch(err => {
        setError(err.message || 'Failed to update tag');
      });
  };
  
  return (
    <dialog id="tag_info_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Tag Information</h3>
        <div className="py-4">
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {!isEditing ? (
            // Display mode
            <div>
              <div className="mb-4">
                <h4 className="font-semibold">Name:</h4>
                <p>{tag?.name}</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Description:</h4>
                <p>{tag?.description || 'No description available'}</p>
              </div>
            </div>
          ) : (
            // Edit mode
            <div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tag Name</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  value={editedTag.name}
                  onChange={(e) => setEditedTag({...editedTag, name: e.target.value})}
                />
              </div>
              
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Description (optional)</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24" 
                  value={editedTag.description}
                  onChange={(e) => setEditedTag({...editedTag, description: e.target.value})}
                ></textarea>
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-action">
          {!isEditing ? (
            <>
              {canUpdate && (
                <button 
                  className="btn btn-secondary" 
                  onClick={handleEdit}
                >
                  Edit
                </button>
              )}
              <button 
                className="btn" 
                onClick={onClose}
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button 
                className="btn" 
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSave}
                disabled={!editedTag.name.trim() || loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default TagInfoModal;
