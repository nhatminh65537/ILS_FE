import React from 'react';

const EditPermissionDialog = ({ editingPermission, setEditingPermission, handleUpdatePermissionDescription }) => {
  if (!editingPermission) return null;
  
  return (
    <dialog open className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Permission Description</h3>
        <div className="py-4">
          <div className="form-control">
            <label className="label block">
              <span className="label-text">Permission Name</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered" 
              value={editingPermission.name} 
              disabled 
            />
          </div>
          <div className="form-control mt-4">
            <label className="label block">
              <span className="label-text">Description</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered" 
              value={editingPermission.newDescription || ''} 
              onChange={(e) => setEditingPermission({
                ...editingPermission,
                newDescription: e.target.value
              })}
            />
          </div>
        </div>
        <div className="modal-action">
          <button 
            className="btn"
            onClick={() => setEditingPermission(null)}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => handleUpdatePermissionDescription(
              editingPermission
            )}
            disabled={!editingPermission.newDescription || editingPermission.newDescription === editingPermission.description}
          >
            Save
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={() => setEditingPermission(null)}></div>
    </dialog>
  );
};

export default EditPermissionDialog;
