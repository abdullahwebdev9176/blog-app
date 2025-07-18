import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
export const uploadToCloudinary = async (file, options = {}) => {
  try {
    // Convert file to buffer if it's not already
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to Cloudinary using upload_stream
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: 'blog-images', // Organize images in a folder
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' }, // Resize large images
          { quality: 'auto' }, // Auto optimize quality
          { fetch_format: 'auto' } // Auto choose best format
        ],
        ...options
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Error preparing file for Cloudinary upload:', error);
    throw error;
  }
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Get optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    ...options,
    secure: true
  });
};

export default cloudinary;
