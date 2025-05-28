import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createModule } from '../../../store/modulesSlice';

const CreateModuleModal = ({ 
  isOpen, 
  onClose, 
  categories, 
  lifecycleStates, 
  tags, 
  loading 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    categoryId: '',
    lifecycleStateId: '',
    imagePath: '',
    duration: 0,
    xp: 0,
    tagIds: []
  });

  const handleModuleTagChange = (tagId) => {
    setNewModule(prev => {
      const newTagIds = prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId];
      
      return {
        ...prev,
        tagIds: newTagIds
      };
    });
  };

  const handleCreateModule = async () => {
    if (!newModule.title.trim() || !newModule.description.trim() || 
        !newModule.categoryId || !newModule.lifecycleStateId) return;
    
    const result = await dispatch(createModule({
      title: newModule.title.trim(),
      description: newModule.description.trim(),
      categoryId: parseInt(newModule.categoryId),
      lifecycleStateId: parseInt(newModule.lifecycleStateId),
      imagePath: newModule.imagePath.trim() || null,
      duration: parseInt(newModule.duration) || 0,
      xp: parseInt(newModule.xp) || 0,
      tagIds: newModule.tagIds
    }));
    
    if (result.meta.requestStatus === 'fulfilled') {
      setNewModule({
        title: '',
        description: '',
        categoryId: '',
        lifecycleStateId: '',
        imagePath: '',
        duration: 0,
        xp: 0,
        tagIds: []
      });
      onClose();
      
      if (result.payload && result.payload.id) {
        navigate(`/learn/edit/${result.payload.id}`);
      }
    }
  };

  return (
    <dialog id="create_module_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Create New Module</h3>
        <div className="py-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title<span className="text-error">*</span></span>
            </label>
            <input 
              type="text" 
              placeholder="Enter module title" 
              className="input input-bordered w-full" 
              value={newModule.title}
              onChange={(e) => setNewModule({...newModule, title: e.target.value})}
            />
          </div>
          
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Description<span className="text-error">*</span></span>
            </label>
            <textarea 
              placeholder="Enter description" 
              className="textarea textarea-bordered h-24" 
              value={newModule.description}
              onChange={(e) => setNewModule({...newModule, description: e.target.value})}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category<span className="text-error">*</span></span>
              </label>
              <select 
                className="select select-bordered w-full" 
                value={newModule.categoryId}
                onChange={(e) => setNewModule({...newModule, categoryId: e.target.value})}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Lifecycle State<span className="text-error">*</span></span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={newModule.lifecycleStateId}
                onChange={(e) => setNewModule({...newModule, lifecycleStateId: e.target.value})}
              >
                <option value="">Select a state</option>
                {lifecycleStates.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg" 
                className="input input-bordered w-full" 
                value={newModule.imagePath}
                onChange={(e) => setNewModule({...newModule, imagePath: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Duration (min)</span>
                </label>
                <input 
                  type="number" 
                  placeholder="0" 
                  className="input input-bordered w-full" 
                  value={newModule.duration}
                  onChange={(e) => setNewModule({...newModule, duration: e.target.value})}
                  min="0"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">XP Points</span>
                </label>
                <input 
                  type="number" 
                  placeholder="0" 
                  className="input input-bordered w-full" 
                  value={newModule.xp}
                  onChange={(e) => setNewModule({...newModule, xp: e.target.value})}
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Tags</span>
            </label>
            <div className="max-h-40 overflow-y-auto p-2 border rounded-lg">
              {tags.map(tag => (
                <div key={tag.id} className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-sm checkbox-primary" 
                      checked={newModule.tagIds.includes(tag.id)}
                      onChange={() => handleModuleTagChange(tag.id)}
                    />
                    <span className="label-text">{tag.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-action">
          <button 
            className="btn" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleCreateModule}
            disabled={
              !newModule.title.trim() || 
              !newModule.description.trim() || 
              !newModule.categoryId || 
              !newModule.lifecycleStateId || 
              loading
            }
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : 'Create Module'}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default CreateModuleModal;
