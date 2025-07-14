import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import Admin from "@/lib/models/AdminModel";

await connectDB();

export async function POST(request) {
    try {
        const { username, email, password } = await request.json();

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ 
            $or: [{ username }, { email }] 
        });

        if (existingAdmin) {
            return NextResponse.json({ 
                error: "Admin with this username or email already exists" 
            }, { status: 400 });
        }

        // Create new admin
        const admin = await Admin.create({
            username,
            email,
            password
        });

        return NextResponse.json({
            success: true,
            message: "Admin created successfully",
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });
    } catch (error) {
        console.error("Admin creation error:", error);
        return NextResponse.json({ 
            error: "Failed to create admin" 
        }, { status: 500 });
    }
}
