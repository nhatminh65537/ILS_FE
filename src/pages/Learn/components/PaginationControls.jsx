import React from 'react';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center my-4">
      <div className="join">
        <button 
          className="join-item btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>
        
        {currentPage > 2 && (
          <button
            className="join-item btn"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
        )}
        
        {currentPage > 3 && (
          <button className="join-item btn btn-disabled">...</button>
        )}
        
        {currentPage > 1 && (
          <button
            className="join-item btn"
            onClick={() => onPageChange(currentPage - 1)}
          >
            {currentPage - 1}
          </button>
        )}
        
        <button className="join-item btn btn-active">
          {currentPage}
        </button>
        
        {currentPage < totalPages && (
          <button
            className="join-item btn"
            onClick={() => onPageChange(currentPage + 1)}
          >
            {currentPage + 1}
          </button>
        )}
        
        {currentPage < totalPages - 2 && (
          <button className="join-item btn btn-disabled">...</button>
        )}
        
        {currentPage < totalPages - 1 && (
          <button
            className="join-item btn"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        )}
        
        <button 
          className="join-item btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
