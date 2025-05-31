import React, { useState, useRef, useEffect } from 'react';
import { uploadImageFile, getImageFileFromClipboard } from '../../../utils/fileUpload';

// Update the props to include username
const AvatarUploadModal = ({ isOpen, onClose, currentAvatar, onSave, username = 'user' }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreviewUrl(currentAvatar);
      setError('');
    }
  }, [isOpen, currentAvatar]);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processSelectedFile(file);
    }
  };
  
  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };
  
  // Handle paste from clipboard
  const handlePaste = async (e) => {
    const file = await getImageFileFromClipboard(e);
    if (file) {
      processSelectedFile(file);
    }
  };
  
  // Process the selected file (validation & preview)
  const processSelectedFile = (file) => {
    if (!file.type.match('image.*')) {
      setError('Please select a valid image file');
      return;
    }
    
    if (file.size > 1024 * 1024 * 2) { // 2MB limit
      setError('Image size should be less than 2MB');
      return;
    }
    
    setSelectedFile(file);
    setError('');
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle save button click
  const handleSave = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      // Upload the file and get the URL path, passing username for the filename
      const imageUrl = await uploadImageFile(selectedFile, username);
      
      // Call the parent component's save handler with the new URL
      onSave(imageUrl.url);
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Prevent events from bubbling up during drag
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal modal-open">
      <div className="modal-box" ref={modalRef}>
        <h3 className="font-bold text-lg">Update Profile Picture</h3>
        
        {/* Error alert */}
        {error && (
          <div className="alert alert-error mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {/* Image preview */}
        <div className="flex flex-col items-center my-4">
          <div className="avatar">
            <div className="w-32 h-32 rounded-full">
              <img src={previewUrl || "https://picsum.photos/200"} alt="Avatar preview" />
            </div>
          </div>
        </div>
        
        {/* Upload options */}
        <div 
          className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center my-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onPaste={handlePaste}
        >
          <p className="mb-4">Drag & drop an image here, or paste from clipboard (Ctrl+V)</p>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => fileInputRef.current.click()}
          >
            Select Image
          </button>
        </div>
        
        <div className="modal-action">
          <button className="btn" onClick={onClose} disabled={isUploading}>Cancel</button>
          <button 
            className="btn btn-primary" 
            onClick={handleSave} 
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? <span className="loading loading-spinner loading-sm"></span> : 'Save'}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default AvatarUploadModal;
