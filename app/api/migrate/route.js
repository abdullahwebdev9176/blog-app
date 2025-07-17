import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import Comment from "@/lib/models/CommentModel";

// Connect to the database
await connectDB();

export async function POST(req) {
    try {
        // Find all comments that don't have a status field or have null/undefined status
        const commentsWithoutStatus = await Comment.find({
            $or: [
                { status: { $exists: false } },
                { status: null },
                { status: undefined },
                { status: "" }
            ]
        });
        
        console.log(`Found ${commentsWithoutStatus.length} comments without proper status field`);
        
        // Update all comments without status to 'approved'
        const updateResult = await Comment.updateMany(
            {
                $or: [
                    { status: { $exists: false } },
                    { status: null },
                    { status: undefined },
                    { status: "" }
                ]
            },
            {
                $set: {
                    status: 'approved',
                    updatedAt: new Date()
                }
            }
        );
        
        console.log(`Updated ${updateResult.modifiedCount} comments with status 'approved'`);
        
        // Verify the update
        const allComments = await Comment.find({});
        const commentsWithStatus = allComments.filter(comment => comment.status);
        
        console.log(`Total comments: ${allComments.length}`);
        console.log(`Comments with status: ${commentsWithStatus.length}`);
        
        return NextResponse.json({
            success: true,
            message: "Comments migration completed successfully",
            totalComments: allComments.length,
            updatedComments: updateResult.modifiedCount,
            commentsWithStatus: commentsWithStatus.length
        });
        
    } catch (error) {
        console.error("Error migrating comments:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
