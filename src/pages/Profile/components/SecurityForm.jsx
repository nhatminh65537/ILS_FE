import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserData } from '../../../store/myUserSlice';

const SecurityForm = ({ userId }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear specific error when user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data for API
      const updateData = {
        id: userId,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };
      
      await dispatch(updateUserData(updateData)).unwrap();
      setSuccessMessage('Password updated successfully!');
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Failed to update password:', error);
      setErrors({
        form: typeof error === 'string' ? error : 'Failed to update password. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {successMessage && (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{successMessage}</span>
        </div>
      )}

      {errors.form && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{errors.form}</span>
        </div>
      )}
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Current Password</span>
        </label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className={`input input-bordered ${errors.currentPassword ? 'input-error' : ''}`}
        />
        {errors.currentPassword && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.currentPassword}</span>
          </label>
        )}
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">New Password</span>
        </label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className={`input input-bordered ${errors.newPassword ? 'input-error' : ''}`}
        />
        {errors.newPassword && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.newPassword}</span>
          </label>
        )}
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Confirm New Password</span>
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
        />
        {errors.confirmPassword && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.confirmPassword}</span>
          </label>
        )}
      </div>
      
      <div className="form-control mt-6">
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Update Password'}
        </button>
      </div>
    </form>
  );
};

export default SecurityForm;
