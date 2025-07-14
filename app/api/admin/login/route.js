import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import Admin from "@/lib/models/AdminModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

await connectDB();

export async function POST(request) {
    try {
        const { username, password } = await request.json();
        console.log("Login attempt for username:", username);

        if (!username || !password) {
            return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
        }

        // Find admin user
        const admin = await Admin.findOne({ username });
        console.log("Admin found:", admin ? "Yes" : "No");
        
        if (!admin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        console.log("Password valid:", isPasswordValid);
        
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "24h" }
        );

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });

        // Set httpOnly cookie
        response.cookies.set("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: "/"
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
