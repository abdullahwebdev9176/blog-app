import { connectDB } from "@/lib/config/db";
import { BlogModel } from "@/lib/models/BlogModel";
import { SubscriberModel } from "@/lib/models/SubscriberModel";
import { sendNewPostNotification } from "@/lib/services/emailService";
import { NextResponse } from "next/server";

const LoadDB = async () => {
    await connectDB();
};

export async function POST(request) {
    try {
        await LoadDB();
        
        const { blogId, action } = await request.json();
        
        if (!blogId) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Blog ID is required" 
                },
                { status: 400 }
            );
        }

        // Get the blog post
        const blogPost = await BlogModel.findById(blogId);
        
        if (!blogPost) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Blog post not found" 
                },
                { status: 404 }
            );
        }

        switch (action) {
            case 'send_newsletter':
                // Check if already sent
                if (blogPost.newsletterSent) {
                    return NextResponse.json(
                        { 
                            success: false, 
                            message: "Newsletter has already been sent for this blog post" 
                        },
                        { status: 409 }
                    );
                }

                // Send newsletter
                const result = await sendNewPostNotification(blogPost);
                
                if (result.success) {
                    // Mark as newsletter sent
                    blogPost.newsletterSent = true;
                    blogPost.newsletterSentAt = new Date();
                    await blogPost.save();
                    
                    return NextResponse.json({
                        success: true,
                        message: `Newsletter sent successfully to ${result.totalSent} subscribers`,
                        data: {
                            totalSent: result.totalSent,
                            totalFailed: result.totalFailed,
                            blogTitle: blogPost.title
                        }
                    });
                } else {
                    return NextResponse.json(
                        { 
                            success: false, 
                            message: result.error || "Failed to send newsletter" 
                        },
                        { status: 500 }
                    );
                }

            case 'check_status':
                return NextResponse.json({
                    success: true,
                    data: {
                        blogId: blogPost._id,
                        title: blogPost.title,
                        newsletterSent: blogPost.newsletterSent || false,
                        newsletterSentAt: blogPost.newsletterSentAt || null
                    }
                });

            default:
                return NextResponse.json(
                    { 
                        success: false, 
                        message: "Invalid action. Use 'send_newsletter' or 'check_status'" 
                    },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error("Error processing newsletter request:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: "Failed to process newsletter request",
                error: error.message 
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        await LoadDB();
        
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'stats';
        
        switch (action) {
            case 'stats':
                // Get newsletter sending statistics
                const totalSubscribers = await SubscriberModel.countDocuments({ isActive: true });
                const totalBlogPosts = await BlogModel.countDocuments();
                const newslettersSent = await BlogModel.countDocuments({ newsletterSent: true });
                const pendingNotifications = await BlogModel.countDocuments({ 
                    newsletterSent: { $ne: true } 
                });
                
                // Get recent newsletters
                const recentNewsletters = await BlogModel
                    .find({ newsletterSent: true })
                    .sort({ newsletterSentAt: -1 })
                    .limit(10)
                    .select('title author newsletterSentAt')
                    .lean();
                
                return NextResponse.json({
                    success: true,
                    stats: {
                        totalSubscribers,
                        totalBlogPosts,
                        newslettersSent,
                        pendingNotifications,
                        recentNewsletters
                    }
                });

            case 'pending':
                // Get blog posts that haven't had newsletters sent
                const pendingPosts = await BlogModel
                    .find({ newsletterSent: { $ne: true } })
                    .sort({ createdAt: -1 })
                    .select('title author category createdAt')
                    .lean();
                
                return NextResponse.json({
                    success: true,
                    pendingPosts
                });

            default:
                return NextResponse.json(
                    { 
                        success: false, 
                        message: "Invalid action" 
                    },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error("Error fetching newsletter data:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: "Failed to fetch newsletter data",
                error: error.message 
            },
            { status: 500 }
        );
    }
}
