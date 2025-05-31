import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserData } from '../../../store/myUserSlice';

const PersonalInfoForm = ({ userData, profile }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: userData?.userName || '',
    email: userData?.email || '',
    phoneNumber: userData?.phoneNumber || '',
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    displayName: profile?.displayName || '',
    bio: profile?.bio || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // Prepare the data for API - email removed as it's now read-only
      const updateData = {
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName,
          bio: formData.bio,
        }
      };

      await dispatch(updateUserData(updateData)).unwrap();
      setSuccessMessage('Profile information updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            className="input input-bordered bg-base-200"
            disabled
          />
          <label className="label">
            <span className="label-text-alt text-info">Username cannot be changed</span>
          </label>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="input input-bordered bg-base-200"
            disabled
          />
          <label className="label">
            <span className="label-text-alt text-info">Email cannot be changed</span>
          </label>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone Number</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Display Name</span>
          </label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Bio</span>
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="textarea textarea-bordered h-24"
        ></textarea>
      </div>
      
      {/* Display read-only info */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-base-300">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">XP</span>
            </label>
            <div className="text-lg">{profile.xp || 0}</div>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Level</span>
            </label>
            <div className="text-lg">{profile.level || 0}</div>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Last Updated</span>
            </label>
            <div className="text-sm opacity-70">
              {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>
      )}
      
      <div className="form-control mt-6">
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
