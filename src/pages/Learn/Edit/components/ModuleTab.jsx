import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, fetchTags, fetchLifecycleStates } from '../../../../store/modulesSlice';
import { uploadImageFile } from '../../../../utils/fileUpload';

const ModuleTab = ({ moduleId, onChange, unsavedChanges = {}, onSave, onDelete }) => {
  const dispatch = useDispatch();
  const { moduleData, categories, lifecycleStates, tags } = useSelector(state => ({
    moduleData: state.contentEdit.currentModule || {},
    categories: state.modules.categories,
    lifecycleStates: state.modules.lifecycleStates,
    tags: state.modules.tags
  }));
  
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagSearch, setTagSearch] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  
  // Fetch required data for dropdowns
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
    dispatch(fetchLifecycleStates());
  }, [dispatch]);
  
  useEffect(() => {
    // Initialize selected tags from module data
    if (moduleData.tags) {
      setSelectedTags(moduleData.tags.map(tag => tag.id));
    }
  }, [moduleData.tags]);
  
  const handleChange = (field, value) => {
    onChange({ [field]: value });  // Add 'module' type
  };
  
  const handleTagChange = (tagId) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newSelectedTags);
    onChange({ tagIds: newSelectedTags });
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const url = await uploadImageFile(file);
      handleChange('imagePath', url);
    } catch (err) {
      alert(err.message || 'Failed to upload image');
    }
    setImageUploading(false);
  };
  
  // Filter tags based on search input
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );
  
  const imagePath = unsavedChanges.imagePath !== undefined ? unsavedChanges.imagePath : moduleData.imagePath;
  
  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">Module Settings</h2>
      
        <div className="form-control">
          <label className="label block">
            <span className="label-text">Title</span>
          </label>
          <input 
            type="text"
            className="input input-bordered"
            value={(unsavedChanges.title !== undefined ? unsavedChanges.title : moduleData.title) || ''}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={(unsavedChanges.categoryId !== undefined ? unsavedChanges.categoryId : moduleData.category?.id) || ''}
            onChange={(e) => handleChange('categoryId', parseInt(e.target.value))}
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
            <span className="label-text">Lifecycle State</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={(unsavedChanges.lifecycleStateId !== undefined ? unsavedChanges.lifecycleStateId : moduleData.lifecycleState?.id) || ''}
            onChange={(e) => handleChange('lifecycleStateId', parseInt(e.target.value))}
          >
            {lifecycleStates.map(state => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Duration (minutes)</span>
            </label>
            <input 
              type="number"
              className="input input-bordered"
              disabled={true}
              value={(unsavedChanges.duration !== undefined ? unsavedChanges.duration : moduleData.duration) || 0}
              onChange={(e) => handleChange('duration', parseInt(e.target.value))}
              min="0"
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">XP Points</span>
            </label>
            <input 
              type="number"
              disabled={true}
              className="input input-bordered"
              value={(unsavedChanges.xp !== undefined ? unsavedChanges.xp : moduleData.xp) || 0}
              onChange={(e) => handleChange('xp', parseInt(e.target.value))}
              min="0"
            />
          </div>
        </div>
      </div>

        
      <div className="form-control flex gap-2">
          {imagePath && (
            <div className="mt-2">
              <img 
                src={imagePath} 
                alt="Module thumbnail" 
                className="h-40 object-cover rounded-md border border-b-2 "
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
          <div className="flex-1">
            <label className="label">
              <span className="label-text">Image URL</span>
            </label>
            <div className="flex gap-2">
              <input 
                type="text"
                className="input input-bordered w-full"
                value={imagePath || ''}
                onChange={(e) => handleChange('imagePath', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <label className="btn btn-outline btn-md">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                />
                {imageUploading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <span>Upload</span>
                )}
              </label>
            </div>
          </div>
        </div>
        
        
      
      <div className="form-control mt-6">
        <label className="label block">
          <span className="label-text">Description</span>
        </label>
        <textarea 
          className="textarea textarea-bordered h-24"
          value={(unsavedChanges.description !== undefined ? unsavedChanges.description : moduleData.description) || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        ></textarea>
      </div>
      
      <div className="form-control mt-6">
        <label className="label block">
          <span className="label-text">Tags</span>
        </label>
        {/* Tag search input */}
        <input
          type="text"
          className="input input-sm mb-2"
          placeholder="Search tags..."
          value={tagSearch}
          onChange={e => setTagSearch(e.target.value)}
        />
        <div className="grid grid-cols-3 max-h-40 overflow-y-auto p-2 border rounded-lg">
          {filteredTags.length === 0 && (
            <div className="text-base-content/50 px-2 py-1">No tags found</div>
          )}
          {filteredTags.map(tag => (
            <div key={tag.id} className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm checkbox-primary" 
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                />
                <span className="label-text">{tag.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 border-t pt-4">
        <button 
          className="btn btn-error" 
          onClick={onDelete}
        >
          Delete Module
        </button>
      </div>
      
      {/* Floating save button */}
      {Object.keys(unsavedChanges || {}).length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button className="btn btn-primary" onClick={onSave}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default ModuleTab;
