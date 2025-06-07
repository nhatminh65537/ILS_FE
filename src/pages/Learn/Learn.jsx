import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchModules, 
  fetchCategories, 
  fetchTags, 
  fetchLifecycleStates,
  setSearchTerm,
  setFilters,
  setPage,
  setPageSize,
  initializePageSize,
} from '../../store/modulesSlice';
import { hasPermission } from '../../store/myUserSlice';
import { PERMISSIONS } from '../../constants/permissions';
// import ModuleCard from '../../components/ModuleCard';
// import AddModuleCard from '../../components/AddModuleCard';

// Imported components
import FilterPanel from './components/FilterPanel';
import PaginationControls from './components/PaginationControls';
import CreateTagModal from './components/CreateTagModal';
import CreateCategoryModal from './components/CreateCategoryModal';
import DeleteTagModal from './components/DeleteTagModal';
import DeleteCategoryModal from './components/DeleteCategoryModal';
import CreateModuleModal from './components/CreateModuleModal';
import ModulesGrid from './components/ModulesGrid';
import CategoryInfoModal from './components/CategoryInfoModal';
import TagInfoModal from './components/TagInfoModal';
import LifecycleStateInfoModal from './components/LifecycleStateInfoModal';

const Learn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    modules,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    searchTerm,
    filters,
    loading,
    error,
    categories,
    tags,
    lifecycleStates,
    filtersLoading
  } = useSelector(state => state.modules);
  
  const canCreateModule = useSelector(state => hasPermission(state, PERMISSIONS.Modules.Create));
  const canCreateTag = useSelector(state => hasPermission(state, PERMISSIONS.Tags.Create));
  const canDeleteTag = useSelector(state => hasPermission(state, PERMISSIONS.Tags.Delete));
  const canUpdateTag = useSelector(state => hasPermission(state, PERMISSIONS.Tags.Update));
  const canCreateCategory = useSelector(state => hasPermission(state, PERMISSIONS.Categories.Create));
  const canDeleteCategory = useSelector(state => hasPermission(state, PERMISSIONS.Categories.Delete));
  const canUpdateCategory = useSelector(state => hasPermission(state, PERMISSIONS.Categories.Update));
  const canGetAllLifecycleStates = true || useSelector(state => hasPermission(state, PERMISSIONS.LifecycleStates.GetAll));

  const [localFilters, setLocalFilters] = useState({
    categoryIds: [],
    tagIds: [],
    lifecycleStateIds: []
  });
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  
  // Modal states
  const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isCreateModuleModalOpen, setIsCreateModuleModalOpen] = useState(false);
  const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [isCategoryInfoModalOpen, setIsCategoryInfoModalOpen] = useState(false);
  const [isTagInfoModalOpen, setIsTagInfoModalOpen] = useState(false);
  const [isLifecycleStateInfoModalOpen, setIsLifecycleStateInfoModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedLifecycleState, setSelectedLifecycleState] = useState(null);
  
  useEffect(() => {
    dispatch(initializePageSize(canCreateModule));
    dispatch(fetchCategories());
    dispatch(fetchTags());
    dispatch(fetchLifecycleStates());
    dispatch(fetchModules({
      page: currentPage,
      pageSize,
      searchTerm,
      filters
    }));
  }, [dispatch, canCreateModule]);
  
  useEffect(() => {
    dispatch(fetchModules({
      page: currentPage,
      pageSize,
      searchTerm,
      filters
    }));
  }, [dispatch, currentPage, pageSize, searchTerm, filters]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(localSearchTerm));
  };
  
  const handleFilterChange = (newFilters) => {
    setLocalFilters(newFilters);
  };
  
  const applyFilters = () => {
    dispatch(setFilters(localFilters));
  };
  
  const resetFilters = () => {
    setLocalFilters({
      categoryIds: [],
      tagIds: [],
      lifecycleStateIds: []
    });
    dispatch(setFilters({}));
    setLocalSearchTerm('');
    dispatch(setSearchTerm(''));
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };
  
  const openDeleteTagModal = (tag) => {
    setTagToDelete(tag);
    setIsDeleteTagModalOpen(true);
  };
  
  const openDeleteCategoryModal = (category) => {
    setCategoryToDelete(category);
    setIsDeleteCategoryModalOpen(true);
  };

  const openCategoryInfoModal = (category) => {
    setSelectedCategory(category);
    setIsCategoryInfoModalOpen(true);
  };

  const openTagInfoModal = (tag) => {
    setSelectedTag(tag);
    setIsTagInfoModalOpen(true);
  };
  
  const openLifecycleStateInfoModal = (lifecycleState) => {
    setSelectedLifecycleState(lifecycleState);
    setIsLifecycleStateInfoModalOpen(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 p-4 bg-base-100 rounded-lg shadow-lg">
          <form onSubmit={handleSearch} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Search Modules</h3>
            <div className="form-control">
              <div className="join w-full">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="input input-bordered join-item flex-grow"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn join-item">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
          
          <FilterPanel 
            categories={categories}
            lifecycleStates={lifecycleStates}
            tags={tags}
            filters={localFilters}
            onFilterChange={handleFilterChange}
            onApplyFilters={applyFilters}
            onResetFilters={resetFilters}
            onCreateTag={() => setIsCreateTagModalOpen(true)}
            onDeleteTag={openDeleteTagModal}
            onTagInfo={openTagInfoModal}
            onCreateCategory={() => setIsCreateCategoryModalOpen(true)}
            onDeleteCategory={openDeleteCategoryModal}
            onCategoryInfo={openCategoryInfoModal}
            onLifecycleStateInfo={openLifecycleStateInfoModal}
            canCreateTag={canCreateTag}
            canDeleteTag={canDeleteTag}
            canUpdateTag={canUpdateTag}
            canCreateCategory={canCreateCategory}
            canDeleteCategory={canDeleteCategory}
            canUpdateCategory={canUpdateCategory}
            canGetAllLifecycleStates={canGetAllLifecycleStates}
            filtersLoading={filtersLoading}
          />
        </div>
        
        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Learning Modules</h2>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn">
                Items per page: {pageSize}
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {[5, 10, 20, 50].map(size => (
                  <li key={size}>
                    <a onClick={() => dispatch(setPageSize(size))}>
                      {size} items
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {typeof error === 'string' 
                  ? error 
                  : 'An error occurred while loading modules.'
                }
              </span>
            </div>
          )}
          
          {!loading && !error && totalItems > 0 && (
            <PaginationControls 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          
          {loading && (
            <div className="flex justify-center my-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
          
          {!loading && !error && (
            <ModulesGrid
              modules={modules}
              canCreateModule={canCreateModule}
              onAddClick={() => setIsCreateModuleModalOpen(true)}
            />
          )}
          
          {!loading && !error && totalItems > 0 && (
            <PaginationControls 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          
          {!loading && !error && (
            <div className="text-center mt-4 text-sm text-base-content/70">
              Showing {modules.length} of {totalItems} modules | Page {currentPage} of {totalPages || 1}
            </div>
          )}
        </div>
      </div>
      
      <CreateTagModal
        isOpen={isCreateTagModalOpen}
        onClose={() => setIsCreateTagModalOpen(false)}
        loading={filtersLoading}
      />
      
      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        loading={filtersLoading}
      />
      
      <CreateModuleModal
        isOpen={isCreateModuleModalOpen}
        onClose={() => setIsCreateModuleModalOpen(false)}
        categories={categories}
        lifecycleStates={lifecycleStates}
        tags={tags}
        loading={loading}
      />
      
      <DeleteTagModal
        isOpen={isDeleteTagModalOpen}
        onClose={() => {
          setIsDeleteTagModalOpen(false);
          setTagToDelete(null);
        }}
        tag={tagToDelete}
        loading={loading}
      />
      
      <DeleteCategoryModal
        isOpen={isDeleteCategoryModalOpen}
        onClose={() => {
          setIsDeleteCategoryModalOpen(false);
          setCategoryToDelete(null);
        }}
        category={categoryToDelete}
        loading={loading}
      />

      <CategoryInfoModal
        isOpen={isCategoryInfoModalOpen}
        onClose={() => {
          setIsCategoryInfoModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        canUpdate={canUpdateCategory}
        loading={loading} 
      />
      
      <TagInfoModal
        isOpen={isTagInfoModalOpen}
        onClose={() => {
          setIsTagInfoModalOpen(false);
          setSelectedTag(null);
        }}
        tag={selectedTag}
        setTag={setSelectedTag}
        canUpdate={canUpdateTag}
        loading={loading}
      />
      
      <LifecycleStateInfoModal
        isOpen={isLifecycleStateInfoModalOpen}
        onClose={() => {
          setIsLifecycleStateInfoModalOpen(false);
          setSelectedLifecycleState(null);
        }}
        lifecycleState={selectedLifecycleState}
      />
    </div>
  );
};

export default Learn;
