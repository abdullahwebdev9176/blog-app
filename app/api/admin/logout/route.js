import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const response = NextResponse.json({
            success: true,
            message: "Logout successful"
        });

        // Clear the admin token cookie
        response.cookies.set("adminToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
            path: "/"
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
