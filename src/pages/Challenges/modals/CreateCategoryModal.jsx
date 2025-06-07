import React, { useState, useEffect } from 'react';

const CreateCategoryModal = ({ isOpen, onClose, onSave, category = null, loading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [category, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    if (category) {
      // Update existing category
      onSave({
        id: category.id,
        name: name.trim(),
        description: description.trim()
      });
    } else {
      // Create new category
      onSave({
        name: name.trim(),
        description: description.trim()
      });
    }
  };

  return (
    <dialog id="create_category_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{category ? 'Edit Category' : 'Create New Category'}</h3>
        <div className="py-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category Name</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter category name" 
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
            ) : (category ? 'Update' : 'Create')}
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
