import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRoleToUser, removeRoleFromUser } from '../../../store/permissionManagementSlice';

const UserRolesSection = ({ userRoles, listRoles, userId, canEditUserRoles }) => {
  const [roleAssignSearchTerm, setRoleAssignSearchTerm] = useState('');
  const dispatch = useDispatch();

  // Add role to user
  const handleAddRoleToUser = async (roleId) => {
    await dispatch(addRoleToUser({ userId, roleId }));
  };
  
  // Remove role from user
  const handleRemoveRoleFromUser = async (roleId) => {
    await dispatch(removeRoleFromUser({ userId, roleId }));
  };

  return (
    <div className="mt-8 mb-6">
      <h3 className="text-lg font-bold mb-2">User Roles</h3>
      {userRoles.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-4">
          {userRoles.map(role => (
            <div key={role.id} className="badge badge-primary gap-2">
              {role.name}
              {canEditUserRoles && (
                <button 
                  className="btn btn-xs btn-ghost btn-circle"
                  onClick={() => handleRemoveRoleFromUser(role.id)}
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-base-content/70 mb-4">No roles assigned yet</div>
      )}
      
      {canEditUserRoles && (
        <div className="flex flex-col">
          <h4 className="text-sm font-semibold mb-2">Add Role</h4>
          <div className="flex gap-2">
            <input
              type="text"
              className="input input-bordered input-sm flex-grow"
              placeholder="Search roles to add..."
              value={roleAssignSearchTerm}
              onChange={e => setRoleAssignSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-32 overflow-y-auto mt-2">
            {listRoles
              .filter(role => 
                role.name.toLowerCase().includes(roleAssignSearchTerm.toLowerCase()) &&
                !userRoles.some(r => r.id === role.id)
              )
              .map(role => (
                <div 
                  key={role.id} 
                  className="flex justify-between items-center p-2 hover:bg-base-200 rounded"
                >
                  <span>{role.name}</span>
                  <button 
                    className="btn btn-xs btn-outline"
                    onClick={() => handleAddRoleToUser(role.id)}
                  >
                    Add
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRolesSection;
