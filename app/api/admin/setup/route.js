import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import Admin from "@/lib/models/AdminModel";

await connectDB();

export async function GET(request) {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: "admin" });
        
        if (existingAdmin) {
            return NextResponse.json({ 
                message: "Admin already exists",
                admin: {
                    username: existingAdmin.username,
                    email: existingAdmin.email
                }
            });
        }

        // Create default admin
        const admin = await Admin.create({
            username: "admin",
            email: "admin@example.com",
            password: "password123"
        });

        return NextResponse.json({
            success: true,
            message: "Default admin created successfully",
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });
    } catch (error) {
        console.error("Admin setup error:", error);
        return NextResponse.json({ 
            error: "Failed to setup admin" 
        }, { status: 500 });
    }
}
