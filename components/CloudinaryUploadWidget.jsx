'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

const CloudinaryUploadWidget = ({ onUpload, buttonText = "Upload Image" }) => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <CldUploadWidget
      uploadPreset="blog-uploads" // You'll need to create this in Cloudinary dashboard
      options={{
        multiple: false,
        maxFiles: 1,
        folder: "blog-images",
        resourceType: "image",
        maxFileSize: 10000000, // 10MB
        sources: ['local', 'url'],
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      }}
      onUpload={(result, widget) => {
        setIsUploading(false);
        if (result.event === "success") {
          onUpload(result.info);
        }
      }}
    >
      {({ open }) => {
        function handleOnClick(e) {
          e.preventDefault();
          setIsUploading(true);
          open();
        }
        
        return (
          <button 
            type="button"
            className="btn btn-outline-primary"
            onClick={handleOnClick}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : buttonText}
          </button>
        );
      }}
    </CldUploadWidget>
  );
};

export default CloudinaryUploadWidget;
