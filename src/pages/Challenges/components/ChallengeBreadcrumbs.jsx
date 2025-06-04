import React from 'react';

const ChallengeBreadcrumbs = ({ breadcrumbs, onBreadcrumbClick }) => {
  return (
    <div className="text-sm breadcrumbs mb-4 border border-base-300 rounded-lg p-2 bg-base-100">
      <ul>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.id}>
            <button 
              className={index === breadcrumbs.length - 1 ? 'font-semibold' : 'link link-hover'}
              onClick={() => onBreadcrumbClick(crumb)}
            >
              {crumb.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengeBreadcrumbs;
