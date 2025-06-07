import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  fetchChallengeNodes,
  fetchChallengeCategories,
  fetchChallengeTags,
  fetchChallengeStates,
  setFilter,
  resetFilters,
  setCurrentParentId,
  addBreadcrumb,
  clearBreadcrumbsAfter,
  resetBreadcrumbs,
  createChallengeCategory,
  updateChallengeCategory,
  deleteChallengeCategory,
  createChallengeTag,
  updateChallengeTag,
  deleteChallengeTag,
  createChallengeNode,
  updateChallengeNode,
  deleteChallengeNode,
  createChallengeProblem,
  setCurrentProblem,
  updateChallengeProblem,
    deleteChallengeProblem
} from '../../store/challengeSlice';
import { PERMISSIONS } from '../../constants/permissions';
import ChallengeFilterPanel from './components/ChallengeFilterPanel';
import ChallengeCard from './components/ChallengeCard';
import ChallengeBreadcrumbs from './components/ChallengeBreadcrumbs';
import ChallengeModal from './modals/ChallengeModal';
import CreateUpdateNodeModal from './modals/CreateUpdateNodeModal';

const ChallengesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    folders, 
    problems, 
    categories, 
    tags, 
    states, 
    currentParentId, 
    breadcrumbs,
    loadingFolders, 
    loadingProblems, 
    loadingFilters,
    foldersTotalPages,
    problemsTotalPages,
    foldersTotalCount,
    problemsTotalCount,
    filters 
  } = useSelector(state => state.challenge);
  
  const permissions = useSelector(state => state.myUser.permissionNames);
  
  // State for modals
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showCreateProblemModal, setShowCreateProblemModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  
  // Permission checks
  const canCreateFolder = permissions.includes(PERMISSIONS.ChallengeNode.Create);
  const canEditFolder = permissions.includes(PERMISSIONS.ChallengeNode.Update);
  const canDeleteFolder = permissions.includes(PERMISSIONS.ChallengeNode.Delete);
  
  const canCreateProblem = permissions.includes(PERMISSIONS.ChallengeProblem.Create);
  const canEditProblem = permissions.includes(PERMISSIONS.ChallengeProblem.Update);
  const canDeleteProblem = permissions.includes(PERMISSIONS.ChallengeProblem.Delete);
  
  const canCreateCategory = permissions.includes(PERMISSIONS.ChallengeCategory.Create);
  const canEditCategory = permissions.includes(PERMISSIONS.ChallengeCategory.Update);
  const canDeleteCategory = permissions.includes(PERMISSIONS.ChallengeCategory.Delete);
  
  const canCreateTag = permissions.includes(PERMISSIONS.ChallengeTag.Create);
  const canEditTag = permissions.includes(PERMISSIONS.ChallengeTag.Update);
  const canDeleteTag = permissions.includes(PERMISSIONS.ChallengeTag.Delete);

  // Parse URL params for modals
  const matchChallenge = location.pathname.match(/^\/challenge\/(\d+)$/);
  const matchEdit = location.pathname.match(/^\/challenge\/(\d+)\/edit$/);
  const challengeId = matchChallenge?.[1] || matchEdit?.[1];
  const isEdit = Boolean(matchEdit);
  const isModalOpen = Boolean(challengeId);

  // Initial data loading
  useEffect(() => {
    // Load filter options
    dispatch(fetchChallengeCategories());
    dispatch(fetchChallengeTags());
    dispatch(fetchChallengeStates());
    
    // Reset breadcrumbs when component mounts
    dispatch(resetBreadcrumbs());
    
    // Load initial nodes
    loadChallengeNodes();
  }, [dispatch]);

  useEffect(() => {
    // When currentParentId changes, load nodes for that parent
    loadChallengeNodes();
  }, [currentParentId]);

  const loadChallengeNodes = () => {
    // Load folders (non-problem nodes)
    dispatch(fetchChallengeNodes({
      parentId: currentParentId,
      isProblem: false,
      filters
    }));
    
    // Load problems
    dispatch(fetchChallengeNodes({
      parentId: currentParentId,
      isProblem: true,
      filters
    }));
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilter(newFilters));
  };

  const handleApplyFilters = () => {
    loadChallengeNodes();
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setTimeout(() => loadChallengeNodes(), 0);
  };

  const handleFolderPageChange = (page) => {
    dispatch(setFilter({ folderPage: page }));
    dispatch(fetchChallengeNodes({
      parentId: currentParentId,
      isProblem: false,
      filters: { ...filters, folderPage: page }
    }));
  };

  const handleProblemPageChange = (page) => {
    dispatch(setFilter({ problemPage: page }));
    dispatch(fetchChallengeNodes({
      parentId: currentParentId,
      isProblem: true,
      filters: { ...filters, problemPage: page }
    }));
  };

  const handleFolderSelect = (folder) => {
    dispatch(setCurrentParentId(folder.id));
    dispatch(addBreadcrumb({ id: folder.id, title: folder.title }));
    dispatch(setFilter({ folderPage: 1, problemPage: 1 }));
  };

  const handleProblemSelect = (problem) => {
    dispatch(setCurrentProblem(problem));
    navigate(`/challenge/${problem.problemId || problem.id}`, { replace: false });
  };

  const handleBreadcrumbClick = (crumb) => {
    dispatch(setCurrentParentId(crumb.id));
    dispatch(clearBreadcrumbsAfter(crumb.id));
    dispatch(setFilter({ folderPage: 1, problemPage: 1 }));
  };

  // CRUD handlers for categories
  const handleCreateCategory = (category) => {
    dispatch(createChallengeCategory(category));
  };

  const handleUpdateCategory = (data) => {
    dispatch(updateChallengeCategory(data));
  };

  const handleDeleteCategory = (id) => {
    dispatch(deleteChallengeCategory(id));
  };

  // CRUD handlers for tags
  const handleCreateTag = (tag) => {
    dispatch(createChallengeTag(tag));
  };

  const handleUpdateTag = (data) => {
    dispatch(updateChallengeTag(data));
  };

  const handleDeleteTag = (id) => {
    dispatch(deleteChallengeTag(id));
  };

  // CRUD handlers for nodes
  const handleCreateFolder = () => {
    setShowCreateFolderModal(true);
  };

  const handleCreateProblem = () => {
    setShowCreateProblemModal(true);
  };

  const handleEditNode = (node) => {
    setEditingNode(node);
    setShowEditModal(true);
  };

  const handleDeleteNode = (nodeId, isProblem) => {
    dispatch(deleteChallengeNode({ id: nodeId, isProblem }));
  };

  // Separate handlers for folder and problem
  const handleSubmitFolder = async (folderData) => {
    try {
      await dispatch(createChallengeNode(folderData)).unwrap();
      return true;
    } catch (error) {
      console.error('Error saving folder:', error);
      return false;
    }
  };

  const handleSubmitProblem = async (problemData) => {
    try {
      const result = await dispatch(createChallengeProblem(problemData)).unwrap();
      return result;
    } catch (error) {
      console.error('Error saving problem:', error);
      return null;
    }
  };

  const handleEditSubmitFolder = async (node) => {
    try {
        await dispatch(updateChallengeNode({ id: editingNode.id, node })).unwrap();
        setEditingNode(null);
        setShowEditModal(false);
        return true;
    } catch (error) {
        console.error('Error updating node:', error);
        return false;
    }
};
    const handleEditSubmitProblem = async (problem) => {
    try {
        await dispatch(updateChallengeProblem({ id: editingNode.problem.id, problem })).unwrap();
        setEditingNode(null);
        setShowEditModal(false);
        return true;
    } catch (error) {
        console.error('Error updating node:', error);
        return false;
    }
};

  const handleCloseModal = () => {
    navigate('/challenge', { replace: false });
  };

  // Render pagination components
  const renderFoldersPagination = () => {
    if (foldersTotalPages <= 1) return null;
    
    return (
      <div className="join mt-4 flex justify-center">
        {Array.from({ length: foldersTotalPages }).map((_, index) => (
          <button 
            key={index} 
            className={`join-item btn ${filters.folderPage === index + 1 ? 'btn-active' : ''}`}
            onClick={() => handleFolderPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  const renderProblemsPagination = () => {
    if (problemsTotalPages <= 1) return null;
    
    return (
      <div className="join mt-4 flex justify-center">
        {Array.from({ length: problemsTotalPages }).map((_, index) => (
          <button 
            key={index} 
            className={`join-item btn ${filters.problemPage === index + 1 ? 'btn-active' : ''}`}
            onClick={() => handleProblemPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter sidebar */}
        <div className="md:col-span-1 flex flex-col">
          {/* Breadcrumbs beside sidebar */}

          <ChallengeFilterPanel
            categories={categories}
            states={states}
            tags={tags}
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            onCreateTag={handleCreateTag}
            onUpdateTag={handleUpdateTag}
            onDeleteTag={handleDeleteTag}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            canCreateTag={canCreateTag}
            canUpdateTag={canEditTag}
            canDeleteTag={canDeleteTag}
            canCreateCategory={canCreateCategory}
            canUpdateCategory={canEditCategory}
            canDeleteCategory={canDeleteCategory}
            filtersLoading={loadingFilters}
          />
        </div>
        
        {/* Content area */}
        <div className="md:col-span-3">
          {/* Breadcrumbs on top of content for mobile/small screens */}

          {/* Navigation buttons: pre, parent, post */}
          <div className="flex gap-2">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                // Find previous sibling in breadcrumbs
                const idx = breadcrumbs.findIndex(b => b.id === currentParentId);
                if (idx > 1) {
                  const prev = breadcrumbs[idx - 1];
                  handleBreadcrumbClick(prev);
                }
              }}
              disabled={breadcrumbs.length < 2 || breadcrumbs.findIndex(b => b.id === currentParentId) <= 1}
            >
              ⬅️ 
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                // Go to parent node if not at root
                if (breadcrumbs.length > 1) {
                  const parent = breadcrumbs[breadcrumbs.length - 2];
                  handleBreadcrumbClick(parent);
                }
              }}
              disabled={breadcrumbs.length < 2}
            >
              ⬆️ 
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                // Find next sibling in breadcrumbs
                const idx = breadcrumbs.findIndex(b => b.id === currentParentId);
                if (idx !== -1 && idx < breadcrumbs.length - 1) {
                  const next = breadcrumbs[idx + 1];
                  handleBreadcrumbClick(next);
                }
              }}
              disabled={(() => {
                const idx = breadcrumbs.findIndex(b => b.id === currentParentId);
                return idx === -1 || idx >= breadcrumbs.length - 1;
              })()}
            >
               ➡️
            </button>
            <div className="mb-4">
            <ChallengeBreadcrumbs 
              breadcrumbs={breadcrumbs} 
              onBreadcrumbClick={handleBreadcrumbClick} 
            />
            </div>
          </div>

          <h1 className="text-2xl font-bold">CTF Challenges</h1>

          {/* Action buttons */}
          {(canCreateFolder || canCreateProblem) && (
            <div className="flex justify-end gap-2 mb-4">
              {canCreateFolder && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleCreateFolder}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Folder
                </button>
              )}
              {canCreateProblem && (
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={handleCreateProblem}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Challenge
                </button>
              )}
            </div>
          )}
          
          {/* Folders section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Folders
              {loadingFolders && (
                <span className="loading loading-spinner loading-sm ml-2"></span>
              )}
              {foldersTotalCount > 0 && (
                <span className="badge ml-2">{foldersTotalCount}</span>
              )}
            </h2>
            
            {folders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {folders.map(folder => (
                  <ChallengeCard
                    key={folder.id}
                    item={folder}
                    isFolder={true}
                    onSelect={handleFolderSelect}
                    onEdit={() => handleEditNode(folder)}
                    onDelete={() => handleDeleteNode(folder.id, false)}
                    canEdit={canEditFolder}
                    canDelete={canDeleteFolder}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-base-200 rounded-box">
                {loadingFolders ? (
                  <span>Loading folders...</span>
                ) : (
                  <span>No folders found</span>
                )}
              </div>
            )}
            
            {renderFoldersPagination()}
          </div>
          
          {/* Challenges section */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Challenges
              {loadingProblems && (
                <span className="loading loading-spinner loading-sm ml-2"></span>
              )}
              {problemsTotalCount > 0 && (
                <span className="badge ml-2">{problemsTotalCount}</span>
              )}
            </h2>
            
            {problems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {problems.map(node => (
                  <ChallengeCard
                    key={node.problem.id}
                    item={node.problem}
                    isFolder={false}
                    onSelect={handleProblemSelect}
                    onEdit={() => handleEditNode(node)}
                    onDelete={() => handleDeleteNode(node.problem.id, true)}
                    canEdit={canEditProblem}
                    canDelete={canDeleteProblem}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-base-200 rounded-box">
                {loadingProblems ? (
                  <span>Loading challenges...</span>
                ) : (
                  <span>No challenges found</span>
                )}
              </div>
            )}
            
            {renderProblemsPagination()}
          </div>
        </div>
      </div>

      {/* Folder creation modal */}
      <CreateUpdateNodeModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onSubmitFolder={handleSubmitFolder}
        onSubmitProblem={() => {}}
        isFolder={true}
        parentId={currentParentId}
        categories={categories}
        tags={tags}
        states={states}
      />

      {/* Problem creation modal */}
      <CreateUpdateNodeModal
        isOpen={showCreateProblemModal}
        onClose={() => setShowCreateProblemModal(false)}
        onSubmitFolder={() => {}}
        onSubmitProblem={handleSubmitProblem}
        isFolder={false}
        parentId={currentParentId}
        categories={categories}
        tags={tags}
        states={states}
      />

      {/* Edit modal */}
      <CreateUpdateNodeModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmitFolder={handleEditSubmitFolder}
        onSubmitProblem={handleEditSubmitProblem}
        node={editingNode}
        isFolder={editingNode && !editingNode.isProblem}
        parentId={currentParentId}
        categories={categories}
        tags={tags}
        states={states}
      />

      {/* Challenge view/edit modal from URL */}
      {isModalOpen && (
        <ChallengeModal 
          challengeId={challengeId} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default ChallengesPage;
