import React, { useState } from 'react';

const ChallengeCategoryFilter = ({
  categories,
  selectedCategories,
  onCategoryChange,
  onCreateCategory,
  onDeleteCategory,
  onCategoryInfo,
  canCreateCategory,
  canDeleteCategory,
  canUpdateCategory,
  disabled
}) => {
  const [search, setSearch] = useState('');
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="form-control mb-4">
      <div className="flex justify-between items-center">
        <label className="label">
          <span className="label-text">Categories</span>
        </label>
        {canCreateCategory && (
          <button 
            className="btn btn-sm btn-ghost"
            onClick={onCreateCategory}
            disabled={disabled}
          >
            + New Category
          </button>
        )}
      </div>
      <input
        type="text"
        className="input input-sm mb-2"
        placeholder="Search categories..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        disabled={disabled}
      />
      <div className="max-h-40 overflow-y-auto p-2 border rounded-lg">
        {filteredCategories.length === 0 && (
          <div className="text-base-content/50 px-2 py-1">No categories found</div>
        )}
        {filteredCategories.map(category => (
          <div key={category.id} className="form-control py-1">
            <label className="label cursor-pointer flex justify-between">
              <div className="gap-2 flex items-center">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm checkbox-primary" 
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => onCategoryChange(category.id)}
                  disabled={disabled}
                />
                <span className="label-text">{category.name}</span>
              </div>
              <div className="flex gap-1">
                {canUpdateCategory && (
                  <button
                    className="btn btn-xs btn-info btn-square"
                    onClick={(e) => {
                      e.preventDefault();
                      onCategoryInfo(category);
                    }}
                    disabled={disabled}
                    aria-label="Category info"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                )}
                {canDeleteCategory && (
                  <button
                    className="btn btn-xs btn-error btn-square ml-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteCategory(category.id);
                    }}
                    disabled={disabled}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengeCategoryFilter;
