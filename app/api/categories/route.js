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
        await connectDB();
        
        const categoryId = request.nextUrl.searchParams.get("id");
       
        const body = await request.json();
        const { title } = body;

        if (!title) {
            return NextResponse.json({ message: "Title is required" }, { status: 400 });
        }

        const updatedCategory = await CategoriesModel.findByIdAndUpdate(
            categoryId,
            { title },
            { new: true }
        );

        if (!updatedCategory) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            updatedCategory,
            message: "Category updated successfully"
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({
            success: false,
            message: "Error updating category",
            error: error.message
        }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        
        const categoryId = request.nextUrl.searchParams.get("id");
        console.log(categoryId);

        const deletedCategory = await CategoriesModel.findByIdAndDelete(categoryId);

        return NextResponse.json({
            success: true,
            deletedCategory,
            message: "Category Deleted successfully"
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({
            success: false,
            message: "Error deleting category",
            error: error.message
        }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        await connectDB();
        
        const allCategories = await CategoriesModel.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ allCategories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        }, { status: 500 });
    }
}
