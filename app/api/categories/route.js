// app/api/categories/route.js
import { connectDB } from "@/lib/config/db";
import CategoriesModel from '@/lib/models/CategoriesModel';
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return new Response(JSON.stringify({ message: 'Title is required' }), { status: 400 });
    }

    await connectDB();

    const newCategory = await CategoriesModel.create({ title });

    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}


export async function PUT(request) {
  try {
    const categoryId = request.nextURL.params.get('id');
    const body = await req.json();

    const { title } = body;

    if (!title) {
      return new Response(JSON.stringify({ message: "Title is required" }), { status: 400 });
    }

    const updatedCategory = await CategoriesModel.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    if (!updatedCategory) {
      return new Response(JSON.stringify({ message: "Category not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedCategory), { status: 200 });

  } catch (error) {
    console.error("Error updating category:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}


export async function GET(request){

    const allCategories = await CategoriesModel.find({}).sort({ createdAt: -1 });

    return NextResponse.json({allCategories})
}
