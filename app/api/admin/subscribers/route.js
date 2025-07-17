import { connectDB } from "@/lib/config/db";
import { SubscriberModel } from "@/lib/models/SubscriberModel";
import { NextResponse } from "next/server";

const LoadDB = async () => {
    await connectDB();
};

export async function GET(request) {
    try {
        await LoadDB();
        
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const status = searchParams.get('status') || 'all'; // all, active, inactive
        const search = searchParams.get('search') || '';
        
        // Build query
        let query = {};
        
        if (status === 'active') {
            query.isActive = true;
        } else if (status === 'inactive') {
            query.isActive = false;
        }
        
        if (search) {
            query.email = { $regex: search, $options: 'i' };
        }
        
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        
        // Get subscribers with pagination
        const subscribers = await SubscriberModel
            .find(query)
            .sort({ subscribedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        
        // Get total count for pagination
        const totalSubscribers = await SubscriberModel.countDocuments(query);
        const totalPages = Math.ceil(totalSubscribers / limit);
        
        // Get statistics
        const stats = await SubscriberModel.getSubscriberStats();
        
        return NextResponse.json({
            success: true,
            subscribers,
            pagination: {
                currentPage: page,
                totalPages,
                totalSubscribers,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            stats
        });

    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: "Failed to fetch subscribers" 
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        await LoadDB();
        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Subscriber ID is required" 
                },
                { status: 400 }
            );
        }

        // Find and delete subscriber
        const deletedSubscriber = await SubscriberModel.findByIdAndDelete(id);
        
        if (!deletedSubscriber) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Subscriber not found" 
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Subscriber deleted successfully",
            deletedSubscriber: {
                email: deletedSubscriber.email,
                subscribedAt: deletedSubscriber.subscribedAt
            }
        });

    } catch (error) {
        console.error("Error deleting subscriber:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: "Failed to delete subscriber" 
            },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
    try {
        await LoadDB();
        
        const { id, action } = await request.json();
        
        if (!id || !action) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Subscriber ID and action are required" 
                },
                { status: 400 }
            );
        }

        const subscriber = await SubscriberModel.findById(id);
        
        if (!subscriber) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Subscriber not found" 
                },
                { status: 404 }
            );
        }

        switch (action) {
            case 'activate':
                subscriber.isActive = true;
                break;
            case 'deactivate':
                subscriber.isActive = false;
                break;
            default:
                return NextResponse.json(
                    { 
                        success: false, 
                        message: "Invalid action" 
                    },
                    { status: 400 }
                );
        }

        await subscriber.save();

        return NextResponse.json({
            success: true,
            message: `Subscriber ${action}d successfully`,
            subscriber: {
                id: subscriber._id,
                email: subscriber.email,
                isActive: subscriber.isActive,
                subscribedAt: subscriber.subscribedAt
            }
        });

    } catch (error) {
        console.error("Error updating subscriber:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: "Failed to update subscriber" 
            },
            { status: 500 }
        );
    }
}
