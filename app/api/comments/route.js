import { NextResponse } from "next/server";

// In-memory store (replace with DB in production)
let comments = [];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const blogId = searchParams.get("blogId");
  const blogComments = comments.filter(c => c.blogId === blogId);
  return NextResponse.json({ comments: blogComments });
}

export async function POST(req) {
  const data = await req.json();
  if (!data.blogId || !data.name || !data.text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const comment = {
    id: Date.now().toString(),
    blogId: data.blogId,
    name: data.name,
    text: data.text,
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  return NextResponse.json({ comment });
}
