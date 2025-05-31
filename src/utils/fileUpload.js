/**
 * Uploads a file to the server's public folder and returns the URL path
 * Saves with the format username_datecreate.jpg in the public/avatar/ directory
 */
export const uploadImageFile = async (file, username = 'user') => {
  if (!file || !file.type.match('image.*')) {
    throw new Error('Please select a valid image file');
  }
  
  if (file.size > 1024 * 1024 * 2) { // 2MB limit
    throw new Error('Image size should be less than 2MB');
  }

  try {
    // Format the filename according to the required pattern: username_datecreate.jpg
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = file.name.split('.').pop().toLowerCase();
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${sanitizedUsername}_${dateStr}.${extension}`;
    
    // Create FormData for the API call
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('fileName', fileName);
    
    // In a real implementation, this would be your API endpoint to save to public folder
    const response = await fetch('http://cdn.rougitsune.top/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image to server');
    }
    
    const data = await response.json();
    
    // Return the path where the image was saved (should be /avatar/filename)
    return data;
  } catch (error) {
    // For development: Return a simulated path for testing
    if (process.env.NODE_ENV === 'development') {
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
      const extension = file.name.split('.').pop().toLowerCase();
      const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${sanitizedUsername}_${dateStr}.${extension}`;
      
      console.log('Development mode: Simulating file upload to /avatar/' + fileName);
      return `/avatar/${fileName}`;
    }
    
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

/**
 * Converts a clipboard paste event to a file
 */
export const getImageFileFromClipboard = async (clipboardEvent) => {
  const items = clipboardEvent.clipboardData?.items;
  if (!items) return null;
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      return items[i].getAsFile();
    }
  }
  return null;
};
