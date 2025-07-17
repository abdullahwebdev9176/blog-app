// Migration script to add status field to existing comments
// This is a one-time script to update existing comments

import { connectDB } from "@/lib/config/db";
import Comment from "@/lib/models/CommentModel";

const migrateComments = async () => {
    try {
        await connectDB();
        
        // Find all comments that don't have a status field
        const commentsWithoutStatus = await Comment.find({
            $or: [
                { status: { $exists: false } },
                { status: null },
                { status: undefined }
            ]
        });
        
        console.log(`Found ${commentsWithoutStatus.length} comments without status field`);
        
        // Update all comments without status to 'approved'
        const updateResult = await Comment.updateMany(
            {
                $or: [
                    { status: { $exists: false } },
                    { status: null },
                    { status: undefined }
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
        
        return {
            success: true,
            totalComments: allComments.length,
            updatedComments: updateResult.modifiedCount,
            commentsWithStatus: commentsWithStatus.length
        };
        
    } catch (error) {
        console.error("Error migrating comments:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Export for use in API route
export { migrateComments };
