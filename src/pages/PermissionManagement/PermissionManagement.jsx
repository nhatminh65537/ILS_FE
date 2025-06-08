import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hasPermission } from '../../store/myUserSlice';
import { PERMISSIONS } from '../../constants/permissions';
import {
  fetchAllRoles,
  fetchRolePermissions,
  fetchUserPermissions,
  fetchUserRoles,
  fetchUserByIdentifier,
  addPermissionToRole,
  removePermissionFromRole,
  addPermissionToUser,
  removePermissionFromUser,
  updatePermissionDescription,
  setIsRole,
  setObject,
  fetchAllPermissions,
} from '../../store/permissionManagementSlice';

// Import subcomponents
import Sidebar from './components/Sidebar';
import PermissionsList from './components/PermissionsList';
import EditPermissionDialog from './components/EditPermissionDialog';
import { current } from '@reduxjs/toolkit';

const PermissionManagement = () => {
  const dispatch = useDispatch();
  const {
    currentPermissions,
    isRole,
    object,
    listRoles,
    currentFetchedUser,
    userRoles,
    loading,
    listPermissions,
  } = useSelector(state => state.permissionManagement);
  
  const [pendingChanges, setPendingChanges] = useState({});
  const [editingPermission, setEditingPermission] = useState(null);
  
  // Permission checks
  const canEditRolePermissions = useSelector(state => 
    hasPermission(state, PERMISSIONS.Roles.AddPermission) && 
    hasPermission(state, PERMISSIONS.Roles.RemovePermission)
  );
  
  const canEditUserPermissions = useSelector(state => 
    hasPermission(state, PERMISSIONS.Users.AddPermission) && 
    hasPermission(state, PERMISSIONS.Users.RemovePermission)
  );
  
  const canEditUserRoles = useSelector(state => 
    hasPermission(state, PERMISSIONS.Users.AddRole) && 
    hasPermission(state, PERMISSIONS.Users.RemoveRole)
  );
  
  const canEditPermissionDescription = useSelector(state =>
    hasPermission(state, PERMISSIONS.Permissions.Put)
  );
  
  // Fetch all roles on component mount
  useEffect(() => {
    dispatch(fetchAllRoles());
  }, [dispatch]);
  
  // Handle entity type change
  const handleEntityTypeChange = (isRoleEntity) => {
    dispatch(setIsRole(isRoleEntity));
    setPendingChanges({});
  };
  
  // Handle role selection
  const handleRoleSelect = (role) => {
    dispatch(setObject(role));
    dispatch(fetchRolePermissions(role.id));
    setPendingChanges({});
  };
  
  // Handle user search
  const handleUserSearch = (searchTerm, searchType) => {
    if (!searchTerm.trim()) return;
    
    dispatch(fetchUserByIdentifier({
      identifier: searchTerm,
      type: searchType
    }));
  };
  
  // Handle user selection
  const handleUserSelect = (user) => {
    dispatch(setObject(user));
    dispatch(fetchUserPermissions(user.id));
    dispatch(fetchUserRoles(user.id));
    setPendingChanges({});
  };

  // Fetch all permissions on component mount
  useEffect(() => {
    const fetchPermissions = async () => {
      await dispatch(fetchAllPermissions());
    };
    fetchPermissions();
  }, [dispatch]);

  const getPermissionByName = (name) => {
    return listPermissions.find(permission =>
      permission.name === name
    );
  };
  // Group permissions by category
  const getGroupedPermissions = () => {
    // All permissions organized by resource type
    const allPermissions = [
      {
        group: "Modules",
        permissions: [
          getPermissionByName(PERMISSIONS.Modules.Create),
          getPermissionByName(PERMISSIONS.Modules.Update),
          getPermissionByName(PERMISSIONS.Modules.Delete)
        ]
      },
      {
        group: "ModuleTag",
        permissions: [
          getPermissionByName(PERMISSIONS.Tags.Create),
          getPermissionByName(PERMISSIONS.Tags.Update),
          getPermissionByName(PERMISSIONS.Tags.Delete)
        ]
      },
      {
        group: "ModuleCategory", 
        permissions: [
          getPermissionByName(PERMISSIONS.Categories.Create),
          getPermissionByName(PERMISSIONS.Categories.Update),
          getPermissionByName(PERMISSIONS.Categories.Delete)
        ]
      },
      {
        group: "ModuleNode",
        permissions: [
          getPermissionByName(PERMISSIONS.LearnNodes.Create),
          getPermissionByName(PERMISSIONS.LearnNodes.Update),
          getPermissionByName(PERMISSIONS.LearnNodes.Delete)
        ]
      },
      {
        group: "ModuleLesson",
        permissions: [
          getPermissionByName(PERMISSIONS.Lessons.Create),
          getPermissionByName(PERMISSIONS.Lessons.Update),
          getPermissionByName(PERMISSIONS.Lessons.Delete)
        ]
      },
      {
        group: "ChallengeTag",
        permissions: [
          getPermissionByName(PERMISSIONS.ChallengeTag.Create),
          getPermissionByName(PERMISSIONS.ChallengeTag.Update),
          getPermissionByName(PERMISSIONS.ChallengeTag.Delete)
        ]
      },
      {
        group: "ChallengeCategory",
        permissions: [
          getPermissionByName(PERMISSIONS.ChallengeCategory.Create),
          getPermissionByName(PERMISSIONS.ChallengeCategory.Update),
          getPermissionByName(PERMISSIONS.ChallengeCategory.Delete)
        ]
      },
      {
        group: "ChallengeNode",
        permissions: [
          getPermissionByName(PERMISSIONS.ChallengeNode.Create),
          getPermissionByName(PERMISSIONS.ChallengeNode.Update),
          getPermissionByName(PERMISSIONS.ChallengeNode.Delete)
        ]
      },
      {
        group: "ChallengeProblem",
        permissions: [
          getPermissionByName(PERMISSIONS.ChallengeProblem.Create),
          getPermissionByName(PERMISSIONS.ChallengeProblem.Update),
          getPermissionByName(PERMISSIONS.ChallengeProblem.Delete)
        ]
      },
      {
        group: "Roles",
        permissions: [
          getPermissionByName(PERMISSIONS.Roles.Create),
          getPermissionByName(PERMISSIONS.Roles.Update),
          getPermissionByName(PERMISSIONS.Roles.Delete),
          getPermissionByName(PERMISSIONS.Roles.AddPermission),
          getPermissionByName(PERMISSIONS.Roles.RemovePermission)
        ]
      },
      {
        group: "Users",
        permissions: [
          getPermissionByName(PERMISSIONS.Users.AddRole),
          getPermissionByName(PERMISSIONS.Users.RemoveRole),
          getPermissionByName(PERMISSIONS.Users.AddPermission),
          getPermissionByName(PERMISSIONS.Users.RemovePermission)
        ]
      }
    ];
    
    // Map the real permissions from the server over our organized structure
    const result = {};

    allPermissions.forEach(group => {
      result[group.group] = group.permissions.map(permission => {
        // Find the actual permission from our current permissions list
        const actualPermission = currentPermissions.find(p => p.id === permission.id);

        return {
          ...permission,
          assigned: !!actualPermission
        };
      });
    });
    
    return result;
  };
  
  // Check if a permission is assigned
  const isPermissionAssigned = (permissionId) => {
    return currentPermissions.some(p => p.id === permissionId) ||
           pendingChanges[permissionId] === true;
  };
  
  // Handle permission checkbox change
  const handlePermissionChange = (permissionId, checked) => {
    console.log('Permission change:', permissionId, checked);
    setPendingChanges(prev => ({
      ...prev,
      [permissionId]: checked
    }));
  };
  
  // Save changes
const handleSaveChanges = async () => {
  if (!object) return;

  const currentIds = new Set(currentPermissions.map(p => p.id));

  const promises = [];

  for (const [permissionId, isChecked] of Object.entries(pendingChanges)) {
    const hasPermission = currentIds.has(permissionId);

    if (isChecked && !hasPermission) {
      const action = isRole ? addPermissionToRole : addPermissionToUser;
      promises.push(dispatch(action({ 
        [isRole ? 'roleId' : 'userId']: object.id, 
        permissionId 
      })));
    } else if (!isChecked && hasPermission) {
      const action = isRole ? removePermissionFromRole : removePermissionFromUser;
      promises.push(dispatch(action({ 
        [isRole ? 'roleId' : 'userId']: object.id, 
        permissionId 
      })));
    }
  }

  await Promise.all(promises);
  const refresh = isRole ? fetchRolePermissions : fetchUserPermissions;
  dispatch(refresh(object.id));

  setPendingChanges({});
};
  
  // Reset changes
  const handleResetChanges = () => {
    setPendingChanges({});
  };
  
  // Update permission description
  const handleUpdatePermissionDescription = async (editingPermission) => {
    await dispatch(updatePermissionDescription({ editingPermission }));
    setEditingPermission(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Permission Management</h1>
      
      <div className="flex h-[calc(100vh-200px)] border rounded-lg shadow-md">
        <div className="w-1/4 overflow-y-auto">
          <Sidebar 
            isRole={isRole}
            object={object}
            listRoles={listRoles}
            currentFetchedUser={currentFetchedUser}
            loading={loading}
            handleEntityTypeChange={handleEntityTypeChange}
            handleRoleSelect={handleRoleSelect}
            handleUserSearch={handleUserSearch}
            handleUserSelect={handleUserSelect}
          />
        </div>
        <div className="w-3/4 overflow-y-auto">
          <PermissionsList
            object={object}
            isRole={isRole}
            userRoles={userRoles}
            canEditRolePermissions={canEditRolePermissions}
            canEditUserPermissions={canEditUserPermissions}
            canEditUserRoles={canEditUserRoles}
            canEditPermissionDescription={canEditPermissionDescription}
            listRoles={listRoles}
            getGroupedPermissions={getGroupedPermissions}
            isPermissionAssigned={isPermissionAssigned}
            handlePermissionChange={handlePermissionChange}
            handleSaveChanges={handleSaveChanges}
            handleResetChanges={handleResetChanges}
            setEditingPermission={setEditingPermission}
            pendingChanges={pendingChanges}
            setPendingChanges={setPendingChanges}
          />
        </div>
      </div>
      
      <EditPermissionDialog
        editingPermission={editingPermission}
        setEditingPermission={setEditingPermission}
        handleUpdatePermissionDescription={handleUpdatePermissionDescription}
      />
    </div>
  );
};

export default PermissionManagement;
