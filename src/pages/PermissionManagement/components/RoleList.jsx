import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createRole, 
  updateRole, 
  deleteRole 
} from '../../../store/permissionManagementSlice';
import { PERMISSIONS } from '../../../constants/permissions';
import { hasPermission } from '../../../store/myUserSlice';
import RoleDialog from './RoleDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const RoleList = ({ roles, onSelectRole, selectedRoleId }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  
  const canCreateRole = useSelector(state => hasPermission(state, PERMISSIONS.Roles.Create));
  const canUpdateRole = useSelector(state => hasPermission(state, PERMISSIONS.Roles.Update));
  const canDeleteRole = useSelector(state => hasPermission(state, PERMISSIONS.Roles.Delete));

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = () => {
    setEditingRole(null);
    setIsRoleDialogOpen(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setIsRoleDialogOpen(true);
  };

  const handleDeleteRole = (role) => {
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveRole = (roleData) => {
    if (editingRole) {
      dispatch(updateRole({
        roleId: editingRole.id,
        roleData:{...roleData, id: editingRole.id}
      }));
    } else {
      dispatch(createRole(roleData));
    }
    setIsRoleDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (roleToDelete) {
      dispatch(deleteRole(roleToDelete.id));
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Roles</h2>
        {canCreateRole && (
          <button 
            className="btn btn-sm btn-primary"
            onClick={handleCreateRole}
          >
            + New Role
          </button>
        )}
      </div>

      <input
        type="text"
        className="input input-bordered w-full mb-4"
        placeholder="Search roles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="bg-base-100 rounded-lg shadow-md overflow-y-auto max-h-[60vh]">
        <ul className="divide-y divide-base-300">
          {filteredRoles.length === 0 ? (
            <li className="p-4 text-center text-base-content/70">
              No roles found
            </li>
          ) : (
            filteredRoles.map((role) => (
              <li 
                key={role.id}
                className={`p-3 flex justify-between items-center hover:bg-base-200 transition-colors cursor-pointer ${
                  selectedRoleId === role.id ? 'bg-base-300' : ''
                }`}
                onClick={() => onSelectRole(role)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="font-medium">{role.name}</div>
                  {!role.changeable && (
                    <span className="badge badge-sm">System</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {canUpdateRole && role.changeable && (
                    <button 
                      className="btn btn-xs btn-ghost btn-square"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRole(role);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                  )}
                  {canDeleteRole && role.changeable && (
                    <button 
                      className="btn btn-xs btn-ghost btn-square text-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRole(role);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      
      <RoleDialog
        isOpen={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        onSave={handleSaveRole}
        role={editingRole}
      />
      
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${roleToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default RoleList;
