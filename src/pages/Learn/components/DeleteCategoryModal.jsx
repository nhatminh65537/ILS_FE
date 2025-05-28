import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteCategory } from '../../../store/modulesSlice';

const DeleteCategoryModal = ({ isOpen, onClose, category, loading }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const handleDeleteCategory = async () => {
    if (!category) return;
    
    setError(null);
    const result = await dispatch(deleteCategory(category.id));
    
    if (result.meta.requestStatus === 'fulfilled') {
      onClose();
    } else if (result.payload && result.payload.includes('modules associated')) {
      setError('This category cannot be deleted because it is used by one or more modules.');
    } else {
      setError('Failed to delete category. Please try again later.');
    }
  };

  return (
    <dialog id="delete_category_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Delete Category</h3>
        <div className="py-4">
          <p>Are you sure you want to delete the category "{category?.name}"?</p>
          <p className="text-warning mt-2">This action cannot be undone.</p>
          
          {error && (
            <div className="alert alert-error mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
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
            onClick={handleDeleteCategory}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : 'Delete Category'}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default DeleteCategoryModal;
