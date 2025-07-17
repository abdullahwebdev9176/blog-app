import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import Comment from "@/lib/models/CommentModel";

// Connect to the database
await connectDB();

export async function GET(req) {
    try {
        // Fetch all comments with blog information
        const allComments = await Comment.find({})
            .sort({ createdAt: -1 }) // Sort by newest first
            .lean(); // Use lean() for better performance
        
        console.log("Fetched all comments for admin:", allComments.length);
        return NextResponse.json({ comments: allComments });
    } catch (error) {
        console.error("Error fetching all comments:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("id");

    if (!commentId) {
        return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        
        if (!deletedComment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        console.log("Comment deleted successfully:", commentId);
        return NextResponse.json({ 
            success: true, 
            message: "Comment deleted successfully",
            deletedComment 
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }
}

export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("id");
    
    if (!commentId) {
        return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    try {
        const { status, moderationNote } = await req.json();
        
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { 
                status: status || 'approved',
                moderationNote: moderationNote || '',
                moderatedAt: new Date()
            },
            { new: true }
        );
        
        if (!updatedComment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        console.log("Comment updated successfully:", commentId);
        return NextResponse.json({ 
            success: true, 
            message: "Comment updated successfully",
            comment: updatedComment 
        });
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    }
}
