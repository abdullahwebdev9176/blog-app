import { connectDB } from "@/lib/config/db";
import { BlogModel } from "@/lib/models/BlogModel";
import { NextResponse } from "next/server";
import CategoriesModel from '@/lib/models/CategoriesModel';
import CommentModel from "@/lib/models/CommentModel";
import { SubscriberModel } from "@/lib/models/SubscriberModel";

const LoadDB = async () => {
    await connectDB();
};

export async function GET() {
    try {
        await LoadDB();

        // Get current date and one month ago
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // Fetch all data
        const [blogs, comments, categories, subscribers] = await Promise.all([
            BlogModel.find({}).sort({ createdAt: -1 }),
            CommentModel.find({}).sort({ createdAt: -1 }),
            CategoriesModel.find({}).sort({ createdAt: -1 }),
            SubscriberModel.find({}).sort({ createdAt: -1 })
        ]);

        // Current month data
        const currentMonthBlogs = blogs.filter(blog =>
            new Date(blog.createdAt || blog.date) >= oneMonthAgo
        );
        const currentMonthComments = comments.filter(comment =>
            new Date(comment.createdAt) >= oneMonthAgo
        );
        const currentMonthCategories = categories.filter(category =>
            new Date(category.createdAt) >= oneMonthAgo
        );
        const currentMonthSubscribers = subscribers.filter(subscriber =>
            new Date(subscriber.createdAt) >= oneMonthAgo
        );

        // Previous month data (for comparison)
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        const previousMonthBlogs = blogs.filter(blog => {
            const blogDate = new Date(blog.createdAt || blog.date);
            return blogDate >= twoMonthsAgo && blogDate < oneMonthAgo;
        });
        const previousMonthComments = comments.filter(comment => {
            const commentDate = new Date(comment.createdAt);
            return commentDate >= twoMonthsAgo && commentDate < oneMonthAgo;
        });
        const previousMonthSubscribers = subscribers.filter(subscriber => {
            const subscriberDate = new Date(subscriber.createdAt);
            return subscriberDate >= twoMonthsAgo && subscriberDate < oneMonthAgo;
        });

        // Calculate totals
        const totalBlogs = blogs.length;
        const totalComments = comments.length;
        const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
        const totalCategories = categories.length;
        const totalSubscribers = subscribers.filter(sub => sub.status === 'active').length;

        // Calculate growth percentages
        const calculateGrowth = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        const blogGrowth = calculateGrowth(currentMonthBlogs.length, previousMonthBlogs.length);
        const commentGrowth = calculateGrowth(currentMonthComments.length, previousMonthComments.length);
        const subscriberGrowth = calculateGrowth(currentMonthSubscribers.length, previousMonthSubscribers.length);

        // For views, calculate based on current month vs previous month
        const currentMonthViews = currentMonthBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
        const previousMonthViews = previousMonthBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
        const viewGrowth = calculateGrowth(currentMonthViews, previousMonthViews);

        const categoryGrowth = currentMonthCategories.length;

        // Get recent activity
        const recentBlogs = blogs
            .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
            .slice(0, 5);

        const recentComments = comments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        // Top performing blogs (by views)
        const topBlogs = blogs
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);

        return NextResponse.json({
            success: true,
            stats: {
                totalBlogs,
                totalComments,
                totalViews,
                totalCategories,
                totalSubscribers,
                growth: {
                    blogs: blogGrowth,
                    comments: commentGrowth,
                    views: viewGrowth,
                    categories: categoryGrowth,
                    subscribers: subscriberGrowth
                },
                monthlyData: {
                    currentMonth: {
                        blogs: currentMonthBlogs.length,
                        comments: currentMonthComments.length,
                        views: currentMonthViews,
                        categories: currentMonthCategories.length,
                        subscribers: currentMonthSubscribers.length
                    },
                    previousMonth: {
                        blogs: previousMonthBlogs.length,
                        comments: previousMonthComments.length,
                        views: previousMonthViews,
                        subscribers: previousMonthSubscribers.length
                    }
                },
                recentActivity: {
                    blogs: recentBlogs,
                    comments: recentComments
                },
                topPerforming: {
                    blogs: topBlogs
                }
            }
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch dashboard statistics",
                details: error.message
            },
            { status: 500 }
        );
    }
}
