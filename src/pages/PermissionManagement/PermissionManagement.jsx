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
} from '../../store/permissionManagementSlice';

// Import subcomponents
import Sidebar from './components/Sidebar';
import PermissionsList from './components/PermissionsList';
import EditPermissionDialog from './components/EditPermissionDialog';

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
  
  // Group permissions by category
  const getGroupedPermissions = () => {
    // All permissions organized by resource type
    const allPermissions = [
      {
        group: "Modules",
        permissions: [
          { id: "LearnModules.Create", name: "LearnModules.Create", description: "Create Module" },
          { id: "LearnModules.Update", name: "LearnModules.Update", description: "Update Module" },
          { id: "LearnModules.Delete", name: "LearnModules.Delete", description: "Delete Module" }
        ]
      },
      {
        group: "ModuleTag",
        permissions: [
          { id: "LearnTags.Create", name: "LearnTags.Create", description: "Create ModuleTag" },
          { id: "LearnTags.Update", name: "LearnTags.Update", description: "Update ModuleTag" },
          { id: "LearnTags.Delete", name: "LearnTags.Delete", description: "Delete ModuleTag" }
        ]
      },
      {
        group: "ModuleCategory", 
        permissions: [
          { id: "LearnCategories.Create", name: "LearnCategories.Create", description: "Create ModuleCategory" },
          { id: "LearnCategories.Update", name: "LearnCategories.Update", description: "Update ModuleCategory" },
          { id: "LearnCategories.Delete", name: "LearnCategories.Delete", description: "Delete ModuleCategory" }
        ]
      },
      {
        group: "ModuleNode",
        permissions: [
          { id: "LearnNodes.Create", name: "LearnNodes.Create", description: "Create ModuleNode" },
          { id: "LearnNodes.Update", name: "LearnNodes.Update", description: "Update ModuleNode" },
          { id: "LearnNodes.Delete", name: "LearnNodes.Delete", description: "Delete ModuleNode" }
        ]
      },
      {
        group: "ModuleLesson",
        permissions: [
          { id: "LearnLessons.Create", name: "LearnLessons.Create", description: "Create ModuleLesson" },
          { id: "LearnLessons.Update", name: "LearnLessons.Update", description: "Update ModuleLesson" },
          { id: "LearnLessons.Delete", name: "LearnLessons.Delete", description: "Delete ModuleLesson" }
        ]
      },
      {
        group: "ChallengeTag",
        permissions: [
          { id: "ChallengeTag.Create", name: "ChallengeTag.Create", description: "Create ChallengeTag" },
          { id: "ChallengeTag.Update", name: "ChallengeTag.Update", description: "Update ChallengeTag" },
          { id: "ChallengeTag.Delete", name: "ChallengeTag.Delete", description: "Delete ChallengeTag" }
        ]
      },
      {
        group: "ChallengeCategory",
        permissions: [
          { id: "ChallengeCategory.Create", name: "ChallengeCategory.Create", description: "Create ChallengeCategory" },
          { id: "ChallengeCategory.Update", name: "ChallengeCategory.Update", description: "Update ChallengeCategory" },
          { id: "ChallengeCategory.Delete", name: "ChallengeCategory.Delete", description: "Delete ChallengeCategory" }
        ]
      },
      {
        group: "ChallengeNode",
        permissions: [
          { id: "ChallengeNode.Create", name: "ChallengeNode.Create", description: "Create Challenge Folder" },
          { id: "ChallengeNode.Update", name: "ChallengeNode.Update", description: "Update Challenge Folder" },
          { id: "ChallengeNode.Delete", name: "ChallengeNode.Delete", description: "Delete Challenge Folder" }
        ]
      },
      {
        group: "ChallengeProblem",
        permissions: [
          { id: "ChallengeProblem.Create", name: "ChallengeProblem.Create", description: "Create Challenge" },
          { id: "ChallengeProblem.Update", name: "ChallengeProblem.Update", description: "Update Challenge" },
          { id: "ChallengeProblem.Delete", name: "ChallengeProblem.Delete", description: "Delete Challenge" }
        ]
      },
      {
        group: "Roles",
        permissions: [
          { id: "Roles.Create", name: "Roles.Create", description: "Create Role" },
          { id: "Roles.Update", name: "Roles.Update", description: "Update Role" },
          { id: "Roles.Delete", name: "Roles.Delete", description: "Delete Role" },
          { id: "Roles.AddPermission", name: "Roles.AddPermission", description: "Add Permission to Role" },
          { id: "Roles.RemovePermission", name: "Roles.RemovePermission", description: "Remove Permission from Role" }
        ]
      },
      {
        group: "Users",
        permissions: [
          { id: "Users.AddRole", name: "Users.AddRole", description: "Add Role to User" },
          { id: "Users.RemoveRole", name: "Users.RemoveRole", description: "Remove Role from User" },
          { id: "Users.AddPermission", name: "Users.AddPermission", description: "Add Permission to User" },
          { id: "Users.RemovePermission", name: "Users.RemovePermission", description: "Remove Permission from User" }
        ]
      }
    ];
    
    // Map the real permissions from the server over our organized structure
    const result = {};
    
    allPermissions.forEach(group => {
      result[group.group] = group.permissions.map(permission => {
        // Find the actual permission from our current permissions list
        const actualPermission = currentPermissions.find(p => p.name === permission.name) || 
                                currentPermissions.find(p => p.id === permission.name);
        
        return {
          ...permission,
          id: actualPermission?.id || permission.id,
          description: actualPermission?.description || permission.description,
          // If the permission exists in currentPermissions, mark it as assigned
          assigned: !!actualPermission
        };
      });
    });
    
    return result;
  };
  
  // Check if a permission is assigned
  const isPermissionAssigned = (permissionName) => {
    return currentPermissions.some(p => p.name === permissionName) ||
           pendingChanges[permissionName] === true;
  };
  
  // Handle permission checkbox change
  const handlePermissionChange = (permissionName, checked) => {
    setPendingChanges(prev => ({
      ...prev,
      [permissionName]: checked
    }));
  };
  
  // Save changes
  const handleSaveChanges = async () => {
    if (!object) return;
    
    for (const [permissionName, isChecked] of Object.entries(pendingChanges)) {
      // Find the permission ID from name
      const permission = currentPermissions.find(p => p.name === permissionName);
      const permissionId = permission?.id;
      
      if (!permissionId) continue;
      
      if (isRole) {
        if (isChecked) {
          await dispatch(addPermissionToRole({ 
            roleId: object.id, 
            permissionId 
          }));
        } else {
          await dispatch(removePermissionFromRole({ 
            roleId: object.id, 
            permissionId 
          }));
        }
      } else {
        if (isChecked) {
          await dispatch(addPermissionToUser({ 
            userId: object.id, 
            permissionId 
          }));
        } else {
          await dispatch(removePermissionFromUser({ 
            userId: object.id, 
            permissionId 
          }));
        }
      }
    }
    
    // Refresh permissions
    if (isRole) {
      dispatch(fetchRolePermissions(object.id));
    } else {
      dispatch(fetchUserPermissions(object.id));
    }
    
    setPendingChanges({});
  };
  
  // Reset changes
  const handleResetChanges = () => {
    setPendingChanges({});
  };
  
  // Update permission description
  const handleUpdatePermissionDescription = async (permissionId, description) => {
    await dispatch(updatePermissionDescription({ permissionId, description }));
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
