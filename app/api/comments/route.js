import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import Comment from "@/lib/models/CommentModel";

// Connect to the database
await connectDB();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const blogId = searchParams.get("blogId");

  try {
    const blogComments = await Comment.find({ blogId });
    console.log("Fetched comments:", blogComments);
    return NextResponse.json({ comments: blogComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req) {
  const data = await req.json();
  console.log("Received data for new comment:", data);

  if (!data.blogId || !data.name || !data.text) {
    console.error("Missing fields in request:", data);
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const comment = await Comment.create({
      blogId: data.blogId,
      name: data.name,
      text: data.text,
      createdAt: new Date(),
    });
    console.log("Comment saved successfully:", comment);
    return NextResponse.json({ comment });
  } catch (error) {
    console.error("Error saving comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
