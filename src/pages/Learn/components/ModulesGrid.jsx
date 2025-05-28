import React from 'react';
import ModuleCard from '../../../components/ModuleCard/ModuleCard';
import AddModuleCard from '../../../components/AddModuleCard';

const ModulesGrid = ({ modules, canCreateModule, onAddClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {canCreateModule && <AddModuleCard onAddClick={onAddClick} />}
      
      {modules.map(module => (
        <ModuleCard key={module.id} module={module} />
      ))}
      
      {modules.length === 0 && (
        <div className="col-span-full text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No modules found</h3>
          <p className="text-base-content/70">
            Try adjusting your search or filters to find modules.
          </p>
        </div>
      )}
    </div>
  );
};

export default ModulesGrid;
