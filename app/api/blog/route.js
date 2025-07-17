export const runtime = "nodejs";
import { connectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { BlogModel } from "@/lib/models/BlogModel";

const LoadDB = async () => {
    await connectDB();
};

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
        const timestamp = Date.now();
        const imageByteData = await image.arrayBuffer();
        const buffer = Buffer.from(imageByteData);
        const path = `./public/${timestamp}_${image.name}`;
        await writeFile(path, buffer);
        updateData.image = `/${timestamp}_${image.name}`;
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

            const timestamp = Date.now();
            const image = formData.get("image");
            if (!image) {
                console.error("No image uploaded");
                return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
            }
            const imageByteData = await image.arrayBuffer();
            const buffer = Buffer.from(imageByteData);

            const path = `./public/${timestamp}_${image.name}`;
            await writeFile(path, buffer);

            const imageUrl = `/${timestamp}_${image.name}`;

            console.log("Image URL:", imageUrl);

            const blogData = {
                title: formData.get("title"),
                description: formData.get("description"),
                image: imageUrl,
                category: formData.get("category"),
                author: formData.get("author"),
            };

            console.log("Blog data to be saved:", blogData);

            await BlogModel.create(blogData);

            return NextResponse.json({
                success: true,
                message: "Blog created successfully",
                data: blogData
            });
        } catch (error) {
            console.error("Error creating blog:", error);
            return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }
}