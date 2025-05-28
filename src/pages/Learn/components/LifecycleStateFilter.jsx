import React from 'react';

const LifecycleStateFilter = ({ 
  lifecycleStates, 
  selectedStates, 
  onStateChange, 
  onStateInfo, 
  disabled 
}) => {
  return (
    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text">Lifecycle States</span>
      </label>
      <div className="max-h-40 overflow-y-auto p-2 border rounded-lg">
        {lifecycleStates.map(state => (
          <div key={state.id} className="form-control py-1">
            <label className="label cursor-pointer flex justify-between">
              <div className="gap-2 flex items-center">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm checkbox-accent" 
                  checked={selectedStates.includes(state.id)}
                  onChange={() => onStateChange(state.id)}
                  disabled={disabled}
                />
                <span className="label-text">{state.name}</span>
              </div>
              <div className="flex gap-1">
                <button
                  className="btn btn-xs btn-info btn-square"
                  onClick={(e) => {
                    e.preventDefault();
                    onStateInfo(state);
                  }}
                  disabled={disabled}
                  aria-label="Lifecycle state info"
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
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LifecycleStateFilter;
