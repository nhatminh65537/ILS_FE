import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserData } from '../../../store/myUserSlice';
import AvatarUploadModal from './AvatarUploadModal';

const ProfileHeader = ({ user, profile }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };
  
  const handleSaveAvatar = async (imageUrl) => {
    try {
      // Update profile with the new avatar URL
      await dispatch(updateUserData({
        ...user,
        profile: {
          ...profile,
          avatarPath: imageUrl
        }
      })).unwrap();
    } catch (error) {
      console.error('Failed to update avatar:', error);
      alert('Failed to update avatar. Please try again.');
    }
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row items-center gap-6 bg-base-100 p-6 rounded-box shadow">
        <div className="avatar relative cursor-pointer group" onClick={handleAvatarClick}>
          <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img 
              src={profile?.avatarPath || "https://picsum.photos/200"} 
              alt={`${user.username}'s avatar`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-75 flex items-center justify-center transition-opacity">
              <span className="text-white text-xs font-medium">Change Avatar</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="opacity-70">{user.email}</p>
          <div className="mt-2 flex gap-2 flex-wrap">
            {user.roles && user.roles.map((role) => (
              <span key={role.id} className="badge badge-primary">{role.name}</span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Avatar Upload Modal */}
      <AvatarUploadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentAvatar={profile?.avatarPath || ""}
        onSave={handleSaveAvatar}
        username={user.userName} // Pass the username for the filename
      />
    </>
  );
};

export default ProfileHeader;
