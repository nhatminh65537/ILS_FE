import React, { useState } from 'react';
import ChallengeCategoryFilter from './ChallengeCategoryFilter';
import ChallengeTagFilter from './ChallengeTagFilter';
import ChallengeStateFilter from './ChallengeStateFilter';
import CreateTagModal from '../modals/CreateTagModal';
import CreateCategoryModal from '../modals/CreateCategoryModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

const ChallengeFilterPanel = ({ 
  categories, 
  states, 
  tags, 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onResetFilters, 
  onCreateTag,
  onDeleteTag,
  onUpdateTag,
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory,
  canCreateTag,
  canDeleteTag,
  canUpdateTag,
  canCreateCategory,
  canDeleteCategory,
  canUpdateCategory,
  filtersLoading
}) => {
  // States for modals
  const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const handleCategoryChange = (categoryId) => {
    const updatedCategoryIds = filters.categoryIds.includes(categoryId)
      ? filters.categoryIds.filter(id => id !== categoryId)
      : [...filters.categoryIds, categoryId];
    
    onFilterChange({
      ...filters,
      categoryIds: updatedCategoryIds
    });
  };

  const handleTagChange = (tagId) => {
    const updatedTagIds = filters.tagIds.includes(tagId)
      ? filters.tagIds.filter(id => id !== tagId)
      : [...filters.tagIds, tagId];
    
    onFilterChange({
      ...filters,
      tagIds: updatedTagIds
    });
  };

  const handleStateChange = (stateId) => {
    const updatedStateIds = filters.stateIds.includes(stateId)
      ? filters.stateIds.filter(id => id !== stateId)
      : [...filters.stateIds, stateId];
    
    onFilterChange({
      ...filters,
      stateIds: updatedStateIds
    });
  };

  const handleGetSolvedChange = (e) => {
    onFilterChange({
      ...filters,
      getSolved: e.target.checked
    });
  };

  const handleSearchChange = (e) => {
    onFilterChange({
      ...filters,
      searchTerm: e.target.value
    });
  };

  // Tag operations
  const handleCreateTagClick = () => {
    setEditingTag(null);
    setIsCreateTagModalOpen(true);
  };

  const handleTagInfo = (tag) => {
    setEditingTag(tag);
    setIsCreateTagModalOpen(true);
  };

  const handleDeleteTagClick = (tagId) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag) {
      setDeletingItem({ type: 'Tag', id: tagId, name: tag.name });
      setIsDeleteConfirmModalOpen(true);
    }
  };

  const handleSaveTag = (tagData) => {
    if (editingTag) {
      onUpdateTag({
        id: tagData.id,
        tag: tagData
      });
    } else {
      onCreateTag(tagData);
    }
    setIsCreateTagModalOpen(false);
  };

  // Category operations
  const handleCreateCategoryClick = () => {
    setEditingCategory(null);
    setIsCreateCategoryModalOpen(true);
  };

  const handleCategoryInfo = (category) => {
    setEditingCategory(category);
    setIsCreateCategoryModalOpen(true);
  };

  const handleDeleteCategoryClick = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setDeletingItem({ type: 'Category', id: categoryId, name: category.name });
      setIsDeleteConfirmModalOpen(true);
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      onUpdateCategory({
        id: categoryData.id,
        category: categoryData
      });
    } else {
      onCreateCategory(categoryData);
    }
    setIsCreateCategoryModalOpen(false);
  };

  // Delete confirmation handler
  const handleConfirmDelete = () => {
    if (deletingItem) {
      if (deletingItem.type === 'Tag') {
        onDeleteTag(deletingItem.id);
      } else if (deletingItem.type === 'Category') {
        onDeleteCategory(deletingItem.id);
      }
      setIsDeleteConfirmModalOpen(false);
    }
  };

  return (
    <div className="p-4 bg-base-100 shadow-lg rounded-box">
      <h3 className="text-lg font-semibold mb-4">Filter Challenges</h3>
      
      {/* Search */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Search</span>
        </label>
        <input
          type="text"
          placeholder="Search challenges..."
          className="input input-bordered w-full"
          value={filters.searchTerm || ''}
          onChange={handleSearchChange}
          disabled={filtersLoading}
        />
      </div>

      {/* Show Solved toggle */}
      <div className="form-control mb-4">
        <label className="label cursor-pointer">
          <span className="label-text">Show solved challenges</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={filters.getSolved || false}
            onChange={handleGetSolvedChange}
            disabled={filtersLoading}
          />
        </label>
      </div>
      
      {/* Categories */}
      <ChallengeCategoryFilter
        categories={categories}
        selectedCategories={filters.categoryIds || []}
        onCategoryChange={handleCategoryChange}
        onCreateCategory={handleCreateCategoryClick}
        onDeleteCategory={handleDeleteCategoryClick}
        onCategoryInfo={handleCategoryInfo}
        canCreateCategory={canCreateCategory}
        canDeleteCategory={canDeleteCategory}
        canUpdateCategory={canUpdateCategory}
        disabled={filtersLoading}
      />
      
      {/* Tags */}
      <ChallengeTagFilter
        tags={tags}
        selectedTags={filters.tagIds || []}
        onTagChange={handleTagChange}
        onCreateTag={handleCreateTagClick}
        onDeleteTag={handleDeleteTagClick}
        onTagInfo={handleTagInfo}
        canCreateTag={canCreateTag}
        canDeleteTag={canDeleteTag}
        canUpdateTag={canUpdateTag}
        disabled={filtersLoading}
      />
      
      {/* States */}
      <ChallengeStateFilter
        states={states}
        selectedStates={filters.stateIds || []}
        onStateChange={handleStateChange}
        disabled={filtersLoading}
      />
      
      {/* Filter Actions */}
      <div className="flex flex-col gap-2 mt-6">
        <button 
          className="btn btn-primary" 
          onClick={onApplyFilters}
          disabled={filtersLoading}
        >
          {filtersLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : 'Apply Filters'}
        </button>
        <button 
          className="btn btn-outline" 
          onClick={onResetFilters}
          disabled={filtersLoading}
        >
          Reset Filters
        </button>
      </div>

      {/* Modals */}
      <CreateTagModal
        isOpen={isCreateTagModalOpen}
        onClose={() => setIsCreateTagModalOpen(false)}
        onSave={handleSaveTag}
        tag={editingTag}
        loading={filtersLoading}
      />

      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
        loading={filtersLoading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemType={deletingItem?.type || ''}
        itemName={deletingItem?.name || ''}
        loading={filtersLoading}
      />
    </div>
  );
};

export default ChallengeFilterPanel;
