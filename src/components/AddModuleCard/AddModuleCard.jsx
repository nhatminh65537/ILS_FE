import React from 'react';

const AddModuleCard = ({ onAddClick }) => {
  return (
    <div className="card card-compact bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full" onClick={onAddClick}>
      <div className="card-body flex flex-col items-center justify-center h-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <h2 className="card-title mt-4">Add New Module</h2>
        <p className="text-center text-base-content/70">Click to create a new learning module</p>
      </div>
    </div>
  );
};

export default AddModuleCard;
