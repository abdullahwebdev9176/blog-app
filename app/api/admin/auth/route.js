import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
    try {
        const token = request.cookies.get("adminToken")?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        
        return NextResponse.json({
            authenticated: true,
            admin: {
                id: decoded.id,
                username: decoded.username
            }
        });
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
