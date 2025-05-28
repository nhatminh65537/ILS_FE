import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateCategory } from '../../../store/modulesSlice';

const CategoryInfoModal = ({ 
  isOpen, 
  onClose, 
  category, 
  canUpdate, 
  loading 
}) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState(null);
  
  // Initialize form when category changes
  useEffect(() => {
    if (category) {
      setEditedCategory({
        name: category.name || '',
        description: category.description || ''
      });
    }
  }, [category]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Reset form to original values
    if (category) {
      setEditedCategory({
        name: category.name || '',
        description: category.description || ''
      });
    }
  };
  
  const handleSave = async () => {
    if (!editedCategory.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    setError(null);
    const result = await dispatch(updateCategory({
      id: category.id,
      name: editedCategory.name.trim(),
      description: editedCategory.description.trim() || null
    }));
    
    if (result.meta.requestStatus === 'fulfilled') {
      setIsEditing(false);
      onClose();
    } else {
      setError('Failed to update category. Please try again.');
    }
  };
  
  return (
    <dialog id="category_info_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {isEditing ? 'Edit Category' : 'Category Information'}
        </h3>
        
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
                <p>{category?.name}</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Description:</h4>
                <p>{category?.description || 'No description available'}</p>
              </div>
            </div>
          ) : (
            // Edit mode
            <div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category Name</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  value={editedCategory.name}
                  onChange={(e) => setEditedCategory({...editedCategory, name: e.target.value})}
                />
              </div>
              
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Description (optional)</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24" 
                  value={editedCategory.description}
                  onChange={(e) => setEditedCategory({...editedCategory, description: e.target.value})}
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
                disabled={!editedCategory.name.trim() || loading}
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

export default CategoryInfoModal;
