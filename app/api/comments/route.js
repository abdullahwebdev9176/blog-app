import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import Comment from "@/lib/models/CommentModel";

const LoadDB = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};

export async function GET(req) {
  try {
    await LoadDB(); // Ensure DB connection before proceeding
    
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    // Only fetch approved comments for public display
    const blogComments = await Comment.find({ 
      blogId, 
      status: 'approved' 
    })
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean(); // Use lean() for better performance
    
    console.log("Fetched approved comments:", blogComments.length);
    return NextResponse.json({ comments: blogComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await LoadDB(); // Ensure DB connection before proceeding
    
    const data = await req.json();
    console.log("Received data for new comment:", data);

    if (!data.blogId || !data.name || !data.text) {
      console.error("Missing required fields in request:", data);
      return NextResponse.json({ error: "Missing required fields (blogId, name, text)" }, { status: 400 });
    }

    // Validate email if provided
    if (data.email && !isValidEmail(data.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const commentData = {
      blogId: data.blogId,
      name: data.name.trim(),
      text: data.text.trim(),
      status: 'approved', // Auto-approve for now
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Only add email if provided
    if (data.email && data.email.trim()) {
      commentData.email = data.email.trim().toLowerCase();
    }

    // TODO: Add IP address and user agent for spam detection
    // commentData.ipAddress = req.ip;
    // commentData.userAgent = req.headers.get('user-agent');

    const comment = await Comment.create(commentData);
    console.log("Comment saved successfully:", comment);
    return NextResponse.json({ comment });
  } catch (error) {
    console.error("Error saving comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}

// Helper function to validate email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
