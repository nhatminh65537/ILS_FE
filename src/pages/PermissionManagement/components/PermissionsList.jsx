import React from 'react';
import UserRolesSection from './UserRolesSection';

const PermissionsList = ({
  object,
  isRole,
  userRoles,
  canEditRolePermissions,
  canEditUserPermissions,
  canEditUserRoles,
  canEditPermissionDescription,
  listRoles,
  getGroupedPermissions,
  isPermissionAssigned,
  handlePermissionChange,
  handleSaveChanges,
  handleResetChanges,
  setEditingPermission,
  pendingChanges,
  setPendingChanges
}) => {
  if (!object) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg mb-2">No {isRole ? 'Role' : 'User'} Selected</h3>
          <p>Please select a {isRole ? 'role' : 'user'} from the sidebar to manage permissions.</p>
        </div>
      </div>
    );
  }
  
  const groupedPermissions = getGroupedPermissions();
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {isRole ? `Permissions for Role: ${object.name}` : `Permissions for User: ${object.username}`}
      </h2>
      
      {/* Permissions by group */}
      {Object.entries(groupedPermissions).map(([group, permissions]) => (
        <div key={group} className="mb-6">
          <div className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" defaultChecked /> 
            <div className="collapse-title text-lg font-medium">
              <label className="cursor-pointer flex items-center">
                <input 
                  type="checkbox" 
                  className="checkbox mr-2" 
                  checked={permissions.every(p => isPermissionAssigned(p.name))}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    const changes = {};
                    permissions.forEach(p => {
                      changes[p.name] = newValue;
                    });
                    setPendingChanges(prev => ({...prev, ...changes}));
                  }}
                />
                All actions on {group}
              </label>
            </div>
            <div className="collapse-content">
              {permissions.map(permission => (
                <div key={permission.name} className="ml-8 mb-2">
                  <label className="cursor-pointer flex items-center">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-sm mr-2"
                      checked={isPermissionAssigned(permission.name)}
                      onChange={(e) => handlePermissionChange(permission.name, e.target.checked)}
                    />
                    <span className="flex-grow">{permission.description}</span>
                    {canEditPermissionDescription && (
                      <button 
                        className="btn btn-ghost btn-xs"
                        onClick={() => setEditingPermission({
                          id: permission.id,
                          name: permission.name,
                          description: permission.description,
                          newDescription: permission.description
                        })}
                      >
                        edit
                      </button>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      {/* User roles section (only for users) */}
      {!isRole && (
        <UserRolesSection 
          userRoles={userRoles}
          listRoles={listRoles}
          userId={object.id}
          canEditUserRoles={canEditUserRoles}
        />
      )}
      
      {/* Action buttons */}
      {((isRole && canEditRolePermissions) || (!isRole && canEditUserPermissions)) && Object.keys(pendingChanges).length > 0 && (
        <div className="mt-6 flex gap-2 justify-end">
          <button 
            className="btn btn-outline"
            onClick={handleResetChanges}
          >
            Reset
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default PermissionsList;
