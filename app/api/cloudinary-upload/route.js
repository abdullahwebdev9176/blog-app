export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/config/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." 
      }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 10MB." 
      }, { status: 400 });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file, {
      folder: 'blog-uploads',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    });

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ 
      error: "Failed to upload file to Cloudinary" 
    }, { status: 500 });
  }
}
