import React from 'react';

const ChallengeStateFilter = ({
  states,
  selectedStates,
  onStateChange,
  disabled
}) => {
  return (
    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text">States</span>
      </label>
      <div className="max-h-40 overflow-y-auto p-2 border rounded-lg">
        {states.length === 0 && (
          <div className="text-base-content/50 px-2 py-1">No states found</div>
        )}
        {states.map(state => (
          <div key={state.id} className="form-control py-1">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox checkbox-sm checkbox-primary" 
                checked={selectedStates.includes(state.id)}
                onChange={() => onStateChange(state.id)}
                disabled={disabled}
              />
              <span className="label-text">{state.name}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengeStateFilter;
