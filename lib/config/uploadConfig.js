// Environment configuration for file uploads
export const uploadConfig = {
  // Maximum file size (10MB)
  maxFileSize: 10 * 1024 * 1024,
  
  // Allowed file types
  allowedTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ],
  
  // Upload directory (relative to public)
  uploadDir: 'uploads',
  
  // Check if we're in production environment
  isProduction: process.env.NODE_ENV === 'production',
  
  // Check if we're on Vercel
  isVercel: process.env.VERCEL === '1',
  
  // Get upload path based on environment
  getUploadPath: () => {
    if (uploadConfig.isVercel) {
      // On Vercel, use /tmp directory for temporary storage
      // Note: Files in /tmp are ephemeral and will be lost after function execution
      return '/tmp/uploads';
    }
    // For local development and other environments
    return `${process.cwd()}/public/uploads`;
  },
  
  // Get public URL based on environment
  getPublicUrl: (filename) => {
    return `/uploads/${filename}`;
  },
  
  // Validate file
  validateFile: (file) => {
    const errors = [];
    
    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }
    
    if (!uploadConfig.allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type. Allowed types: ${uploadConfig.allowedTypes.join(', ')}`);
    }
    
    if (file.size > uploadConfig.maxFileSize) {
      errors.push(`File too large. Maximum size: ${Math.round(uploadConfig.maxFileSize / 1024 / 1024)}MB`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default uploadConfig;
