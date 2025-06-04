import React, { useState } from 'react';

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
  const [newTagName, setNewTagName] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [showTagForm, setShowTagForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [tagToEdit, setTagToEdit] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

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

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag({
        name: newTagName.trim(),
        description: newTagDescription.trim() || newTagName.trim()
      });
      setNewTagName('');
      setNewTagDescription('');
      setShowTagForm(false);
    }
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      onCreateCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || newCategoryName.trim()
      });
      setNewCategoryName('');
      setNewCategoryDescription('');
      setShowCategoryForm(false);
    }
  };

  const handleEditTag = (tag) => {
    setTagToEdit(tag);
    setNewTagName(tag.name);
    setNewTagDescription(tag.description);
    setShowTagForm(true);
  };

  const handleUpdateTag = () => {
    if (tagToEdit && newTagName.trim()) {
      onUpdateTag({
        id: tagToEdit.id,
        tag: {
          ...tagToEdit,
          name: newTagName.trim(),
          description: newTagDescription.trim() || newTagName.trim()
        }
      });
      setTagToEdit(null);
      setNewTagName('');
      setNewTagDescription('');
      setShowTagForm(false);
    }
  };

  const handleEditCategory = (category) => {
    setCategoryToEdit(category);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description);
    setShowCategoryForm(true);
  };

  const handleUpdateCategory = () => {
    if (categoryToEdit && newCategoryName.trim()) {
      onUpdateCategory({
        id: categoryToEdit.id,
        category: {
          ...categoryToEdit,
          name: newCategoryName.trim(),
          description: newCategoryDescription.trim() || newCategoryName.trim()
        }
      });
      setCategoryToEdit(null);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setShowCategoryForm(false);
    }
  };

  return (
    <div className="p-4 bg-base-200 rounded-box">
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
          value={filters.searchTerm}
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
            checked={filters.getSolved}
            onChange={handleGetSolvedChange}
            disabled={filtersLoading}
          />
        </label>
      </div>
      
      {/* Categories */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Categories</h4>
          {canCreateCategory && (
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="btn btn-xs btn-primary"
              disabled={filtersLoading}
            >
              {showCategoryForm ? 'Cancel' : '+ Add'}
            </button>
          )}
        </div>
        
        {showCategoryForm && (
          <div className="p-2 border rounded-md mb-2">
            <input
              type="text"
              placeholder="Category name"
              className="input input-sm input-bordered w-full mb-2"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              className="input input-sm input-bordered w-full mb-2"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
            />
            <div className="flex justify-end">
              {categoryToEdit ? (
                <button
                  onClick={handleUpdateCategory}
                  className="btn btn-xs btn-success"
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={handleCreateCategory}
                  className="btn btn-xs btn-success"
                >
                  Create
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map(category => (
            <div key={category.id} className="inline-flex items-center">
              <label className="flex cursor-pointer gap-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={filters.categoryIds.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  disabled={filtersLoading}
                />
                <span>{category.name}</span>
              </label>
              {canUpdateCategory && (
                <button
                  onClick={() => handleEditCategory(category)}
                  className="btn btn-xs btn-ghost btn-circle"
                  disabled={filtersLoading}
                >
                  ✏️
                </button>
              )}
              {canDeleteCategory && (
                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="btn btn-xs btn-ghost btn-circle text-error"
                  disabled={filtersLoading}
                >
                  ❌
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Tags */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Tags</h4>
          {canCreateTag && (
            <button
              onClick={() => setShowTagForm(!showTagForm)}
              className="btn btn-xs btn-primary"
              disabled={filtersLoading}
            >
              {showTagForm ? 'Cancel' : '+ Add'}
            </button>
          )}
        </div>
        
        {showTagForm && (
          <div className="p-2 border rounded-md mb-2">
            <input
              type="text"
              placeholder="Tag name"
              className="input input-sm input-bordered w-full mb-2"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              className="input input-sm input-bordered w-full mb-2"
              value={newTagDescription}
              onChange={(e) => setNewTagDescription(e.target.value)}
            />
            <div className="flex justify-end">
              {tagToEdit ? (
                <button
                  onClick={handleUpdateTag}
                  className="btn btn-xs btn-success"
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={handleCreateTag}
                  className="btn btn-xs btn-success"
                >
                  Create
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <div key={tag.id} className="inline-flex items-center">
              <label className="flex cursor-pointer gap-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={filters.tagIds.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                  disabled={filtersLoading}
                />
                <span>{tag.name}</span>
              </label>
              {canUpdateTag && (
                <button
                  onClick={() => handleEditTag(tag)}
                  className="btn btn-xs btn-ghost btn-circle"
                  disabled={filtersLoading}
                >
                  ✏️
                </button>
              )}
              {canDeleteTag && (
                <button
                  onClick={() => onDeleteTag(tag.id)}
                  className="btn btn-xs btn-ghost btn-circle text-error"
                  disabled={filtersLoading}
                >
                  ❌
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* States */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">States</h4>
        <div className="flex flex-wrap gap-2">
          {states.map(state => (
            <label key={state.id} className="flex cursor-pointer gap-1">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={filters.stateIds.includes(state.id)}
                onChange={() => handleStateChange(state.id)}
                disabled={filtersLoading}
              />
              <span>{state.name}</span>
            </label>
          ))}
        </div>
      </div>
      
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
    </div>
  );
};

export default ChallengeFilterPanel;
