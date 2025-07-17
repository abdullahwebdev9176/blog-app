import { connectDB } from "@/lib/config/db";
import { SubscriberModel } from "@/lib/models/SubscriberModel";
import { NextResponse } from "next/server";

const LoadDB = async () => {
    await connectDB();
};

export async function POST(request) {
    try {
        await LoadDB();
        
        const { email, source = 'website' } = await request.json();
        
        // Validate email
        if (!email) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Email is required" 
                },
                { status: 400 }
            );
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Please enter a valid email address" 
                },
                { status: 400 }
            );
        }

        // Get client IP and user agent for analytics
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";

        // Check if email already exists
        const existingSubscriber = await SubscriberModel.findOne({ 
            email: email.toLowerCase() 
        });

        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                return NextResponse.json(
                    { 
                        success: false, 
                        message: "This email is already subscribed to our newsletter" 
                    },
                    { status: 409 }
                );
            } else {
                // Reactivate previously unsubscribed user
                existingSubscriber.isActive = true;
                existingSubscriber.subscribedAt = new Date();
                existingSubscriber.source = source;
                existingSubscriber.ipAddress = ip;
                existingSubscriber.userAgent = userAgent;
                await existingSubscriber.save();

                return NextResponse.json({
                    success: true,
                    message: "Welcome back! Your subscription has been reactivated",
                    subscriber: {
                        email: existingSubscriber.email,
                        subscribedAt: existingSubscriber.subscribedAt
                    }
                });
            }
        }

        // Create new subscriber
        const newSubscriber = new SubscriberModel({
            email: email.toLowerCase(),
            source,
            ipAddress: ip,
            userAgent
        });

        await newSubscriber.save();

        // Return success response (don't expose sensitive data)
        return NextResponse.json({
            success: true,
            message: "Successfully subscribed to our newsletter!",
            subscriber: {
                email: newSubscriber.email,
                subscribedAt: newSubscriber.subscribedAt
            }
        });

    } catch (error) {
        console.error("Subscription error:", error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const firstError = Object.values(error.errors)[0];
            return NextResponse.json(
                { 
                    success: false, 
                    message: firstError.message 
                },
                { status: 400 }
            );
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "This email is already subscribed to our newsletter" 
                },
                { status: 409 }
            );
        }

        // Generic error response
        return NextResponse.json(
            { 
                success: false, 
                message: "Failed to subscribe. Please try again later." 
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await LoadDB();
        
        // Get subscription statistics
        const stats = await SubscriberModel.getSubscriberStats();
        
        return NextResponse.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error("Error fetching subscription stats:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: "Failed to fetch subscription statistics" 
            },
            { status: 500 }
        );
    }
}
