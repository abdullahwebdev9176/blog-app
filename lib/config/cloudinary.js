import { v2 as cloudinary } from 'cloudinary';

// Check if all required environment variables are present
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing Cloudinary environment variables:', missingVars);
  throw new Error(`Missing required Cloudinary environment variables: ${missingVars.join(', ')}`);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Test Cloudinary configuration
const testCloudinaryConfig = () => {
  try {
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'MISSING',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
    });
    return true;
  } catch (error) {
    console.error('Cloudinary configuration error:', error);
    return false;
  }
};

// Upload image to Cloudinary
export const uploadToCloudinary = async (file, options = {}) => {
  try {
    // Test configuration first
    if (!testCloudinaryConfig()) {
      throw new Error('Cloudinary configuration is invalid');
    }

    // Validate file
    if (!file) {
      throw new Error('No file provided for upload');
    }

    console.log('Starting Cloudinary upload for file:', file.name, 'size:', file.size);

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

      console.log('Cloudinary upload options:', uploadOptions);

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`));
          } else {
            console.log('Cloudinary upload successful:', result.public_id);
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Error preparing file for Cloudinary upload:', error);
    throw new Error(`Upload preparation failed: ${error.message}`);
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
