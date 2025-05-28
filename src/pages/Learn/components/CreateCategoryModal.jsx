import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCategory } from '../../../store/modulesSlice';

const CreateCategoryModal = ({ isOpen, onClose, loading }) => {
  const dispatch = useDispatch();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    
    dispatch(createCategory({
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim() || null
    }));
    
    setNewCategoryName('');
    setNewCategoryDescription('');
    onClose();
  };

  return (
    <dialog id="create_category_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Create New Category</h3>
        <div className="py-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category Name</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter category name" 
              className="input input-bordered w-full" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Description (optional)</span>
            </label>
            <textarea 
              placeholder="Enter description" 
              className="textarea textarea-bordered h-24" 
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
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
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim() || loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : 'Create Category'}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default CreateCategoryModal;
