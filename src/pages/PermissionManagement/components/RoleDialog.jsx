import React, { useState, useEffect } from 'react';

const RoleDialog = ({ isOpen, onClose, onSave, role }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    changeable: true
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    // Initialize form data when editing an existing role
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        changeable: role.changeable !== undefined ? role.changeable : true
      });
    } else {
      // Reset form when creating a new role
      setFormData({
        name: '',
        description: '',
        changeable: true
      });
    }
    setErrors({});
  }, [role, isOpen]);
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Role name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">
          {role ? 'Edit Role' : 'Create New Role'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">
                Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              name="name"
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter role name"
              disabled={role && !role.changeable}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name}</span>
              </label>
            )}
          </div>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered w-full"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter role description"
              disabled={role && !role.changeable}
            />
          </div>
          
          <div className="form-control mb-4">
            <label className="label cursor-pointer">
              <span className="label-text">Allow users to modify this role later</span>
              <input
                type="checkbox"
                name="changeable"
                checked={formData.changeable}
                onChange={handleChange}
                className="checkbox"
                disabled={true}
              />
            </label>
            {role && !formData.changeable && (
              <div className="text-sm text-warning mt-1">
                This system role cannot be modified.
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={role && !role.changeable}
            >
              {role ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleDialog;
