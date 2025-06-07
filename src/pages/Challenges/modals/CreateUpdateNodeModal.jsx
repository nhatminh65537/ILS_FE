import React, { useState, useEffect, useRef } from 'react';
import { uploadChallengeFile, deleteChallengeFile } from '../../../utils/fileUpload';
import { challengeProblemsAPI } from '../../../apis/challengeProblems';

const CreateUpdateNodeModal = ({ 
  isOpen, 
  onClose, 
  onSubmitFolder,
  onSubmitProblem,
  node = null, 
  isFolder = true,
  parentId,
  categories = [],
  tags = [],
  states = []
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isProblem: !isFolder,
    parentNodeId: parentId,
    content: '',
    flagText: '',
    categoryId: categories.length > 0 ? categories[0].id : null,
    xp: 10,
    tagIds: [],
    stateId: states.length > 0 ? states[0].id : null
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(node?.problem?.files || []);
  const [fileInput, setFileInput] = useState('');
  const [tagSearch, setTagSearch] = useState(''); // Add state for tag search
  const fileRef = useRef();

  useEffect(() => {
    if (node && node.problem) {
      setFiles(node.problem.files || []);
    } else {
      setFiles([]);
    }
    if (node) {
      // If editing an existing node
      setFormData({
        id: node.id,
        title: node.title || node.problem?.title || '',
        description: node.description || '',
        isProblem: !isFolder,
        parentNodeId: parentId,
        content: node.problem?.content || '',
        flagText: node.problem?.flag || '',
        categoryId: node.problem?.category.id || (categories.length > 0 ? categories[0].id : null),
        xp: node.problem?.xp || 10,
        tagIds: node.problem?.tags?.map(tag => tag.id) || [],
        stateId: node.problem?.challengeState.id || (states.length > 0 ? states[0].id : null),
      });
    } else {
      // Reset form when creating a new node
      setFormData({
        title: '',
        description: '',
        isProblem: !isFolder,
        parentNodeId: parentId,
        content: '',
        flagText: '',
        categoryId: categories.length > 0 ? categories[0].id : null,
        xp: 10,
        tagIds: [],
        stateId: states.length > 0 ? states[0].id : null,
      });
    }
    setErrors({});
  }, [node, isFolder, parentId, categories, states, isOpen]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!isFolder) {
      if (!formData.content.trim()) {
        newErrors.content = 'Content is required';
      }
      
      if (!formData.flagText.trim()) {
        newErrors.flagText = 'Flag is required';
      }
      
      if (!formData.categoryId) {
        newErrors.categoryId = 'Category is required';
      }

      if (!formData.stateId) {
        newErrors.stateId = 'State is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => {
      const tagIds = [...prev.tagIds];
      
      if (tagIds.includes(tagId)) {
        return {
          ...prev,
          tagIds: tagIds.filter(id => id !== tagId)
        };
      } else {
        return {
          ...prev,
          tagIds: [...tagIds, tagId]
        };
      }
    });
  };

  // File upload handlers
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      // Upload file to backend and get DTO
      const url = await uploadChallengeFile(file, file.name);
      setFiles(prev => [...prev, { fileName: file.name, filePath: url, challengeId: node?.id || 0 }]);
    } catch (err) {
      alert('File upload failed: ' + err.message);
    }
  };

  const handleFilePathAdd = () => {
    if (!fileInput.trim()) return;
    setFiles(prev => [
      ...prev,
      { fileName: fileInput.split('/').pop(), filePath: fileInput, challengeId: node?.id || 0 }
    ]);
    setFileInput('');
  };

  const handleFileDelete = async (fileObj, idx) => {
      try {
        await deleteChallengeFile(fileObj.filePath);
      } catch (err) {
        alert('Failed to delete file: ' + err.message);
        return;
      }
    
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFileEdit = (idx, newFileName, newFilePath) => {
    setFiles(prev =>
      prev.map((f, i) =>
        i === idx
          ? { ...f, fileName: newFileName, filePath: newFilePath }
          : f
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isFolder) {
        // Separate add new folder logic
        const folderData = {
          id: node?.id,
          title: formData.title,
          description: formData.description,
          isProblem: false,
          parentNodeId: parentId
        };
        await onSubmitFolder(folderData);
      } else {
        // Separate add new problem logic
        const problemData = {
          id: node?.problem.id,
          title: formData.title,
          parentNodeId: parentId,
          isProblem: true,
          description: formData.description,
          content: formData.content,
          flag: formData.flagText,
          categoryId: formData.categoryId,
          xp: parseInt(formData.xp),
          tagIds: formData.tagIds,
          challengeStateId: formData.stateId
        };
        // Submit problem first
        const createdProblem = await onSubmitProblem(problemData);
        // Upload files if any (for new problem, createdProblem.id is needed)

        const id = createdProblem.id || node?.problem?.id;

        for (const fileObj of node?.problem?.files || []) {
          if (!files.some(f => f.filePath === fileObj.filePath)) {
            await challengeProblemsAPI.deleteFile(id, fileObj.id);
          }
        }
        
        console.log(node, files)
        for (const fileObj of files) {
          if (!fileObj.id) {
            // If filePath is a URL, treat as external, else upload
            if (fileObj.filePath && !fileObj.file) {
              // External path, call uploadFile API with fileName and filePath
              await challengeProblemsAPI.uploadFile(id, {
                fileName: fileObj.fileName,
                filePath: fileObj.filePath,
                challengeId: id
              });
            } else if (fileObj.file) {
              // Already uploaded via uploadChallengeFile
              // Do nothing, already handled
            }
          }
        }
      }
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg">
          {node ? 'Edit' : 'Create'} {isFolder ? 'Folder' : 'Challenge'}
        </h3>
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">
                Title <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              className={`input input-bordered w-full ${
                errors.title ? 'input-error' : ''
              }`}
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.title}
                </span>
              </label>
            )}
          </div>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              placeholder="Enter description"
              className="textarea textarea-bordered w-full"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          
          {!isFolder && (
            <>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">
                    Content <span className="text-error">*</span>
                  </span>
                </label>
                <textarea
                  name="content"
                  placeholder="Enter challenge content (HTML supported)"
                  className={`textarea textarea-bordered w-full h-40 ${errors.content ? 'textarea-error' : ''}`}
                  value={formData.content}
                  onChange={handleChange}
                ></textarea>
                {errors.content && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.content}
                    </span>
                  </label>
                )}
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">
                    Flag <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="flagText"
                  placeholder="Enter flag (e.g., FLAG{th1s_1s_4_fl4g})"
                  className={`input input-bordered w-full ${
                    errors.flagText ? 'input-error' : ''
                  }`}
                  value={formData.flagText}
                  onChange={handleChange}
                />
                {errors.flagText && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.flagText}
                    </span>
                  </label>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">
                    Category <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  name="categoryId"
                  className={`select select-bordered w-full ${errors.categoryId ? 'select-error' : ''}`}
                  value={formData.categoryId || ''}
                  onChange={handleChange}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.categoryId}
                    </span>
                  </label>
                )}
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">XP (Experience Points)</span>
                </label>
                <input
                  type="number"
                  name="xp"
                  min="0"
                  step="5"
                  placeholder="Enter XP value"
                  className="input input-bordered w-full"
                  value={formData.xp}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">
                    State <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  name="stateId"
                  className={`select select-bordered w-full ${errors.stateId ? 'select-error' : ''}`}
                  value={formData.stateId || ''}
                  onChange={handleChange}
                >
                  {states.map(state => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.stateId && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.stateId}
                    </span>
                  </label>
                )}
              </div>

              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text mr-5">Tags</span>
                </label>
                <input
                  type="text"
                  placeholder="Search tags"
                  className="input input-bordered input-sm mb-2"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  {tags
                    .filter(tag => tag.name.toLowerCase().includes(tagSearch.toLowerCase()))
                    .map(tag => (
                      <div key={tag.id} className="inline-flex items-center">
                        <label className="flex cursor-pointer gap-1">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={formData.tagIds.includes(tag.id)}
                            onChange={() => handleTagToggle(tag.id)}
                          />
                          <span>{tag.name}</span>
                        </label>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* File upload section */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Files</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="file"
                    ref={fileRef}
                    className="file-input file-input-bordered file-input-sm"
                    onChange={handleFileChange}
                  />
                  <input
                    type="text"
                    className="input input-bordered input-sm"
                    placeholder="Enter file path or URL"
                    value={fileInput}
                    onChange={e => setFileInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={handleFilePathAdd}
                  >
                    Add Path
                  </button>
                </div>
                <ul className="list mt-2">
                  {files.map((fileObj, idx) => (
                    <li key={fileObj.id || fileObj.filePath || idx} className="list-row flex items-center gap-2">
                      <input
                        type="text"
                        className="input input-bordered input-xs w-32"
                        value={fileObj.fileName}
                        onChange={e =>
                          handleFileEdit(idx, e.target.value, fileObj.filePath)
                        }
                        placeholder="File name"
                      />
                      <input
                        type="text"
                        className="input input-bordered input-xs w-48"
                        value={fileObj.filePath}
                        onChange={e =>
                          handleFileEdit(idx, fileObj.fileName, e.target.value)
                        }
                        placeholder="File path"
                      />
                      <button
                        type="button"
                        className="btn btn-xs btn-error"
                        onClick={() => handleFileDelete(fileObj, idx)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Save'}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default CreateUpdateNodeModal;
