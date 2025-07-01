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


export async function POST(request) {

    const formData = await request.formData();

    const timestamp = Date.now();
    const image = formData.get("image");
    if (!image) {
        return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);

    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path, buffer);

    const imageUrl = `/${timestamp}_${image.name}`;

    console.log(imageUrl);


    const blogData = {
        title: formData.get("title"),
        description: formData.get("description"),
        image: imageUrl,
        category: formData.get("category"),
        author: formData.get("author"),
    };

    await BlogModel.create(blogData);

    return NextResponse.json({
        succes: true,
        message: "Blog created successfully",
        data: blogData
    });

}