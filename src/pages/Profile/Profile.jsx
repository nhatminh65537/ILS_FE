import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, fetchUserProfile, updateUserData } from '../../store/myUserSlice';
import PersonalInfoForm from './components/PersonalInfoForm';
import SecurityForm from './components/SecurityForm';
import ProfileHeader from './components/ProfileHeader';

const Profile = () => {
  const dispatch = useDispatch();
  const { userData, profile, loading, error } = useSelector((state) => state.myUser);
  const [activeTab, setActiveTab] = useState('personal');

  // Fetch user data if not already loaded
  useEffect(() => {
    if (!userData) {
      dispatch(fetchUserData());
    }
    if (!profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, userData, profile]);

  useEffect(() => {
      dispatch(fetchUserData());
      dispatch(fetchUserProfile());
  }, []);


  // Handle tab changes
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] pt-16">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pt-20 px-4 pb-6">
      <div className="max-w-4xl mx-auto">
        {userData && (
          <>
            <ProfileHeader user={userData} profile={profile} />
            
            <div className="card bg-base-100 shadow-xl mt-6">
              <div className="card-body">
                <div role="tablist" className="tabs tabs-bordered">
                  <button 
                    role="tab" 
                    className={`tab ${activeTab === 'personal' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('personal')}
                  >
                    Personal Information
                  </button>
                  <button 
                    role="tab" 
                    className={`tab ${activeTab === 'security' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('security')}
                  >
                    Security
                  </button>
                </div>
                
                {activeTab === 'personal' && <PersonalInfoForm userData={userData} profile={profile} />}
                {activeTab === 'security' && <SecurityForm userId={userData.id} />}
                
                {error && (
                  <div className="alert alert-error mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{typeof error === 'string' ? error : 'An error occurred. Please try again.'}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
