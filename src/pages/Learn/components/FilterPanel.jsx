import React from 'react';
import TagFilter from './TagFilter';
import CategoryFilter from './CategoryFilter';
import LifecycleStateFilter from './LifecycleStateFilter';

const FilterPanel = ({ 
  categories, 
  lifecycleStates, 
  tags, 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onResetFilters, 
  onCreateTag, 
  onDeleteTag,
  onTagInfo,
  onCreateCategory,
  onDeleteCategory,
  onCategoryInfo,
  onLifecycleStateInfo,
  canCreateTag, 
  canDeleteTag,
  canUpdateTag,
  canCreateCategory,
  canDeleteCategory,
  canUpdateCategory,
  canGetAllLifecycleStates,
  filtersLoading
}) => {
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

  const handleLifecycleStateChange = (stateId) => {
    const updatedStateIds = filters.lifecycleStateIds.includes(stateId)
      ? filters.lifecycleStateIds.filter(id => id !== stateId)
      : [...filters.lifecycleStateIds, stateId];
    
    onFilterChange({
      ...filters,
      lifecycleStateIds: updatedStateIds
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Filter Modules</h3>
      
      <CategoryFilter
        categories={categories}
        selectedCategories={filters.categoryIds}
        onCategoryChange={handleCategoryChange}
        onCreateCategory={onCreateCategory}
        onDeleteCategory={onDeleteCategory}
        onCategoryInfo={onCategoryInfo}
        canCreateCategory={canCreateCategory}
        canDeleteCategory={canDeleteCategory}
        canUpdateCategory={canUpdateCategory}
        disabled={filtersLoading}
      />
      
      <TagFilter
        tags={tags}
        selectedTags={filters.tagIds}
        onTagChange={handleTagChange}
        onCreateTag={onCreateTag}
        onDeleteTag={onDeleteTag}
        onTagInfo={onTagInfo}
        canCreateTag={canCreateTag}
        canDeleteTag={canDeleteTag}
        canUpdateTag={canUpdateTag}
        disabled={filtersLoading}
      />
      
      {canGetAllLifecycleStates && ( <LifecycleStateFilter
        lifecycleStates={lifecycleStates}
        selectedStates={filters.lifecycleStateIds}
        onStateChange={handleLifecycleStateChange}
        onStateInfo={onLifecycleStateInfo}
        disabled={filtersLoading}
      />
      )}
      
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

export default FilterPanel;
