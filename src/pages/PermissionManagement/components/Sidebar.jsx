import React, { useState } from 'react';
import RoleList from './RoleList';

const Sidebar = ({ 
  isRole, 
  object, 
  listRoles, 
  currentFetchedUser, 
  loading, 
  handleEntityTypeChange, 
  handleRoleSelect, 
  handleUserSearch, 
  handleUserSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('username');

  return (
    <div className="p-4 border-r h-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Entity Type</h2>
        <div className="tabs tabs-boxed">
          <button 
            className={`tab ${isRole ? 'tab-active' : ''}`}
            onClick={() => handleEntityTypeChange(true)}
          >
            Roles
          </button>
          <button 
            className={`tab ${!isRole ? 'tab-active' : ''}`}
            onClick={() => handleEntityTypeChange(false)}
          >
            Users
          </button>
        </div>
      </div>
      
      {isRole ? (
        <RoleList 
          roles={listRoles}
          onSelectRole={handleRoleSelect}
          selectedRoleId={object?.id}
        />
      ) : (
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Find User</h2>
          <div className="flex flex-col gap-2 mb-2">
            <select 
              className="select select-bordered mr-2"
              value={searchType}
              onChange={e => setSearchType(e.target.value)}
            >
              <option value="username">Username</option>
              <option value="email">Email</option>
            </select>
            <input
              type="text"
              className="input input-bordered flex-grow"
              placeholder={`Search by ${searchType}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="btn btn-primary w-full"
            onClick={() => handleUserSearch(searchTerm, searchType)}
            disabled={loading || !searchTerm}
          >
            {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Search'}
          </button>
          
          {currentFetchedUser && !currentFetchedUser.error && (
            <div className="mt-3 p-3 border rounded">
              <div className="font-bold">{currentFetchedUser.userName}</div>
              <div className="text-sm text-base-content/70">{currentFetchedUser.email}</div>
              <button
                className="btn btn-sm btn-outline mt-2 w-full"
                onClick={() => handleUserSelect(currentFetchedUser)}
              >
                Select User
              </button>
            </div>
          )}
          
          {currentFetchedUser?.error && (
            <div className="mt-3 p-3 border border-error rounded text-error">
              User not found
            </div>
          )}
        </div>
      )}
      
      {object && (
        <div className="mt-4 p-3 border rounded bg-base-200">
          <h3 className="font-bold">{isRole ? 'Selected Role' : 'Selected User'}</h3>
          <div>{isRole ? object.name : object.userName}</div>
          {!isRole && <div className="text-sm">{object.email}</div>}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
