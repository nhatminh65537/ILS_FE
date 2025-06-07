import React, { useState } from 'react';

const ChallengeTagFilter = ({
  tags,
  selectedTags,
  onTagChange,
  onCreateTag,
  onDeleteTag,
  onTagInfo,
  canCreateTag,
  canDeleteTag,
  canUpdateTag,
  disabled
}) => {
  const [search, setSearch] = useState('');
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="form-control mb-4">
      <div className="flex justify-between items-center">
        <label className="label">
          <span className="label-text">Tags</span>
        </label>
        {canCreateTag && (
          <button 
            className="btn btn-sm btn-ghost"
            onClick={onCreateTag}
            disabled={disabled}
          >
            + New Tag
          </button>
        )}
      </div>
      <input
        type="text"
        className="input input-sm mb-2"
        placeholder="Search tags..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        disabled={disabled}
      />
      <div className="max-h-40 overflow-y-auto p-2 border rounded-lg">
        {filteredTags.length === 0 && (
          <div className="text-base-content/50 px-2 py-1">No tags found</div>
        )}
        {filteredTags.map(tag => (
          <div key={tag.id} className="form-control py-1">
            <label className="label cursor-pointer flex justify-between">
              <div className="gap-2 flex items-center">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm checkbox-primary" 
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => onTagChange(tag.id)}
                  disabled={disabled}
                />
                <span className="label-text">{tag.name}</span>
              </div>
              <div className="flex gap-1">
                {canUpdateTag && (
                  <button
                    className="btn btn-xs btn-info btn-square"
                    onClick={(e) => {
                      e.preventDefault();
                      onTagInfo(tag);
                    }}
                    disabled={disabled}
                    aria-label="Tag info"
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
                {canDeleteTag && (
                  <button
                    className="btn btn-xs btn-error btn-square ml-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteTag(tag.id);
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

export default ChallengeTagFilter;
