import React from 'react';
import { useSelector } from 'react-redux';

const FolderTab = ({ folderId, onChange, unsavedChanges = {}, onSave, onDelete }) => {
  const { contentTree } = useSelector(state => ({
    contentTree: state.contentEdit.contentTree
  }));
  
  // Find the folder data in the content tree
  const findFolderData = (tree, id) => {
    if (!tree) return null;
    
    if (tree.item && tree.item.id === id) {
      return tree.item;
    }
    
    if (tree.children && tree.children.length > 0) {
      for (const child of tree.children) {
        const found = findFolderData(child, id);
        if (found) return found;
      }
    }
    
    return null;
  };
  
  const folderData = findFolderData(contentTree, folderId) || {};
  
  const handleChange = (field, value) => {
    onChange({ [field]: value }, 'folder');  // Add 'folder' type
  };
  
  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">Folder Settings</h2>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input 
          type="text"
          className="input input-bordered"
          value={(unsavedChanges.title !== undefined ? unsavedChanges.title : folderData.title) || ''}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      
      <div className="form-control mt-6">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea 
          className="textarea textarea-bordered h-24"
          value={(unsavedChanges.description !== undefined ? unsavedChanges.description : folderData.description) || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        ></textarea>
      </div>
      
      <div className="form-control mt-6">
        <label className="label">
          <span className="label-text">Order</span>
        </label>
        <input 
          type="number"
          className="input input-bordered w-32"
          value={(unsavedChanges.order !== undefined ? unsavedChanges.order : folderData.order) || 0}
          onChange={(e) => handleChange('order', parseInt(e.target.value))}
        />
      </div>
      
      <div className="mt-8 border-t pt-4">
        <button 
          className="btn btn-error" 
          onClick={onDelete}
        >
          Delete Folder
        </button>
      </div>
      
      {/* Floating save button */}
      {Object.keys(unsavedChanges || {}).length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button className="btn btn-primary" onClick={onSave}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default FolderTab;
