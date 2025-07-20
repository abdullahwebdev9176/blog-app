import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { BlogModel } from "@/lib/models/BlogModel";
import { sendNewPostNotification } from "@/lib/services/emailService";

const LoadDB = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};

export async function POST(request) {
    try {
        await LoadDB();
        
        const now = new Date();
        
        // Find all scheduled posts that should be published now
        const scheduledPosts = await BlogModel.find({
            status: 'scheduled',
            scheduledFor: { $lte: now }
        });

        console.log(`Found ${scheduledPosts.length} posts ready to be published`);

        let publishedCount = 0;
        const results = [];

        for (const post of scheduledPosts) {
            try {
                // Update the post status to published
                post.status = 'published';
                post.publishedAt = now;
                post.scheduledFor = null; // Clear the scheduled date
                
                await post.save();

                // Send newsletter notification for newly published post
                try {
                    const emailResult = await sendNewPostNotification(post);
                    
                    if (emailResult.success) {
                        post.newsletterSent = true;
                        post.newsletterSentAt = now;
                        await post.save();
                        
                        results.push({
                            postId: post._id,
                            title: post.title,
                            published: true,
                            newsletterSent: true,
                            emailsSent: emailResult.totalSent
                        });
                    } else {
                        results.push({
                            postId: post._id,
                            title: post.title,
                            published: true,
                            newsletterSent: false,
                            error: emailResult.error
                        });
                    }
                } catch (emailError) {
                    console.error(`Error sending newsletter for post ${post._id}:`, emailError);
                    results.push({
                        postId: post._id,
                        title: post.title,
                        published: true,
                        newsletterSent: false,
                        error: emailError.message
                    });
                }

                publishedCount++;
                console.log(`Published post: ${post.title} (ID: ${post._id})`);

            } catch (error) {
                console.error(`Error publishing post ${post._id}:`, error);
                results.push({
                    postId: post._id,
                    title: post.title,
                    published: false,
                    error: error.message
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully processed ${publishedCount} scheduled posts`,
            publishedCount,
            totalScheduled: scheduledPosts.length,
            results
        });

    } catch (error) {
        console.error("Error in scheduler:", error);
        return NextResponse.json({ 
            error: "Failed to process scheduled posts",
            details: error.message 
        }, { status: 500 });
    }
}

// GET endpoint to check scheduled posts without publishing them
export async function GET(request) {
    try {
        await LoadDB();
        
        const now = new Date();
        
        // Find all scheduled posts
        const scheduledPosts = await BlogModel.find({
            status: 'scheduled'
        }).select('title scheduledFor createdAt');

        const readyToPublish = scheduledPosts.filter(post => 
            new Date(post.scheduledFor) <= now
        );

        const futureScheduled = scheduledPosts.filter(post => 
            new Date(post.scheduledFor) > now
        );

        return NextResponse.json({
            success: true,
            totalScheduled: scheduledPosts.length,
            readyToPublish: readyToPublish.length,
            futureScheduled: futureScheduled.length,
            scheduledPosts: scheduledPosts.map(post => ({
                id: post._id,
                title: post.title,
                scheduledFor: post.scheduledFor,
                readyToPublish: new Date(post.scheduledFor) <= now
            }))
        });

    } catch (error) {
        console.error("Error checking scheduled posts:", error);
        return NextResponse.json({ 
            error: "Failed to check scheduled posts",
            details: error.message 
        }, { status: 500 });
    }
}
