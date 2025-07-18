export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/config/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files[]");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.type}`);
      }

      // Validate file size (5MB limit for editor uploads)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("File too large. Maximum size is 5MB.");
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file, {
        folder: 'blog-editor-uploads',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });

      return {
        success: 1,
        file: {
          url: result.secure_url,
          publicId: result.public_id
        }
      };
    });

    const results = await Promise.all(uploadPromises);
    
    // Return in format expected by Jodit
    return NextResponse.json({
      success: 1,
      files: results.map(r => r.file)
    });

  } catch (error) {
    console.error("Jodit upload error:", error);
    return NextResponse.json({ 
      success: 0,
      error: error.message || "Failed to upload files"
    }, { status: 500 });
  }
}
