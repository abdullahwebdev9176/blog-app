export const runtime = "nodejs";
import { connectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { BlogModel } from "@/lib/models/BlogModel";
import { sendNewPostNotification } from "@/lib/services/emailService";

const LoadDB = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};

// Ensure database connection before handling requests
LoadDB().catch((error) => {
    console.error("Error connecting to the database:", error);
});

export async function PUT(request) {
  const blogId = request.nextUrl.searchParams.get("id");
  if (!blogId) {
    return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
  }
  try {
    const contentType = request.headers.get("content-type") || "";
    let updateData = {};
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      updateData.title = formData.get("title");
      updateData.category = formData.get("category");
      updateData.description = formData.get("description");
      updateData.author = formData.get("author");
      const image = formData.get("image");
      if (image && typeof image === "object" && image.name) {
        try {
          // Validate file type
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(image.type)) {
            return NextResponse.json({ 
              error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." 
            }, { status: 400 });
          }

          // Validate file size (10MB limit)
          const maxSize = 10 * 1024 * 1024; // 10MB
          if (image.size > maxSize) {
            return NextResponse.json({ 
              error: "File too large. Maximum size is 10MB." 
            }, { status: 400 });
          }

          const timestamp = Date.now();
          const imageByteData = await image.arrayBuffer();
          const buffer = Buffer.from(imageByteData);
          
          // Create uploads directory if it doesn't exist
          const { mkdir } = await import("fs/promises");
          const { join } = await import("path");
          const { existsSync } = await import("fs");
          
          const uploadsDir = join(process.cwd(), "public", "uploads");
          if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
          }

          const filename = `${timestamp}_${image.name}`;
          const filepath = join(uploadsDir, filename);
          
          await writeFile(filepath, buffer);
          updateData.image = `/uploads/${filename}`;
        } catch (fileError) {
          console.error("Error saving image:", fileError);
          return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
        }
      }
    } else {
      const body = await request.json();
      updateData = body;
    }
    const updated = await BlogModel.findByIdAndUpdate(
      blogId,
      updateData,
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Blog updated successfully", blog: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const blogId = request.nextUrl.searchParams.get("id");
  if (!blogId) {
    return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
  }
  try {
    const deleted = await BlogModel.findByIdAndDelete(blogId);
    if (!deleted) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}

export async function GET(request) {

    const blogId = request.nextUrl.searchParams.get("id");
    if (blogId) {
        const blog = await BlogModel.findById(blogId);
        if (!blog) {   
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }
        return NextResponse.json({ blog });
    }

    const Blogs = await BlogModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({Blogs});
}


export async function PATCH(request) {
    const { blogId } = await request.json();
    
    if (!blogId) {
        return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }
    
    try {
        const blog = await BlogModel.findById(blogId);
        
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }
        
        blog.views += 1;
        await blog.save();
        
        return NextResponse.json({ 
            success: true, 
            views: blog.views,
            message: "View count updated successfully" 
        });
    } catch (error) {
        console.error("Error updating view count:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request) {
    // Ensure database connection
    try {
        await LoadDB();
    } catch (dbError) {
        console.error("Database connection error:", dbError);
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        // Handle like/unlike functionality
        const { blogId, action } = await request.json();

        if (!blogId || !["like", "unlike"].includes(action)) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        try {
            const blog = await BlogModel.findById(blogId);

            if (!blog) {
                return NextResponse.json({ error: "Blog not found" }, { status: 404 });
            }

            if (action === "like") {
                blog.likes += 1;
            } else if (action === "unlike" && blog.likes > 0) {
                blog.likes -= 1;
            }

            await blog.save();

            return NextResponse.json({ success: true, likes: blog.likes });
        } catch (error) {
            console.error("Error toggling like:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    } else if (contentType.includes("multipart/form-data")) {
        // Handle blog creation
        try {
            const formData = await request.formData();
            console.log("Received formData:", Array.from(formData.entries()));

            // Validate required fields
            const title = formData.get("title");
            const description = formData.get("description");
            const category = formData.get("category");
            const author = formData.get("author");
            const image = formData.get("image");

            if (!title || !description || !category || !author) {
                console.error("Missing required fields");
                return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
            }

            if (!image) {
                console.error("No image uploaded");
                return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
            }

            // Handle image upload
            let imageUrl;
            try {
                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(image.type)) {
                    return NextResponse.json({ 
                        error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." 
                    }, { status: 400 });
                }

                // Validate file size (10MB limit)
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (image.size > maxSize) {
                    return NextResponse.json({ 
                        error: "File too large. Maximum size is 10MB." 
                    }, { status: 400 });
                }

                const timestamp = Date.now();
                const imageByteData = await image.arrayBuffer();
                const buffer = Buffer.from(imageByteData);

                // Create uploads directory if it doesn't exist
                const { mkdir } = await import("fs/promises");
                const { join } = await import("path");
                const { existsSync } = await import("fs");
                
                const uploadsDir = join(process.cwd(), "public", "uploads");
                if (!existsSync(uploadsDir)) {
                    await mkdir(uploadsDir, { recursive: true });
                }

                const filename = `${timestamp}_${image.name}`;
                const filepath = join(uploadsDir, filename);
                
                await writeFile(filepath, buffer);
                console.log("Image saved successfully to:", filepath);
                
                imageUrl = `/uploads/${filename}`;
            } catch (fileError) {
                console.error("Error saving image:", fileError);
                return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
            }

            console.log("Image URL:", imageUrl);

            const blogData = {
                title,
                description,
                image: imageUrl,
                category,
                author,
            };

            console.log("Blog data to be saved:", blogData);

            let newBlog;
            try {
                newBlog = await BlogModel.create(blogData);
                console.log("Blog created successfully:", newBlog._id);
            } catch (dbError) {
                console.error("Database error creating blog:", dbError);
                return NextResponse.json({ 
                    error: "Failed to save blog to database", 
                    details: dbError.message 
                }, { status: 500 });
            }

            // Send newsletter to all subscribers automatically for published posts
            try {
                console.log("Sending newsletter notification for new blog post...");
                const emailResult = await sendNewPostNotification(newBlog);
                
                if (emailResult.success) {
                    // Mark newsletter as sent
                    newBlog.newsletterSent = true;
                    newBlog.newsletterSentAt = new Date();
                    await newBlog.save();
                    
                    console.log(`Newsletter sent successfully to ${emailResult.totalSent} subscribers`);
                    
                    return NextResponse.json({
                        success: true,
                        message: "Blog created successfully and newsletter sent to subscribers",
                        data: {
                            blog: blogData,
                            newsletter: {
                                sent: true,
                                totalSent: emailResult.totalSent,
                                totalFailed: emailResult.totalFailed
                            }
                        }
                    });
                } else {
                    console.warn("Newsletter sending failed:", emailResult.error);
                    
                    return NextResponse.json({
                        success: true,
                        message: "Blog created successfully but newsletter sending failed",
                        data: {
                            blog: blogData,
                            newsletter: {
                                sent: false,
                                error: emailResult.error
                            }
                        }
                    });
                }
            } catch (emailError) {
                console.error("Error sending newsletter:", emailError);
                
                return NextResponse.json({
                    success: true,
                    message: "Blog created successfully but newsletter sending encountered an error",
                    data: {
                        blog: blogData,
                        newsletter: {
                            sent: false,
                            error: emailError.message
                        }
                    }
                });
            }
        } catch (error) {
            console.error("Error creating blog:", error);
            return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }
}