import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        'type': String,
        required: true
    },
    slug: {
        'type': String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    description: {
        'type': String,
        required: true
    },
    excerpt: {
        'type': String,
        required: false,
        maxlength: 200,
        trim: true
    },
    image: {
        'type': String,
        required: true
    },
    imagePublicId: {
        'type': String,
        required: false // For Cloudinary public ID
    },
    author: {
        'type': String,
        required: true
    },
    date: {
        'type': Date,
        default: Date.now
    },
    category: {
        'type': String,
        required: true
    },
    views: {
        'type': Number,
        default: 0
    },
    comments: {
        'type': Number,
        default: 0
    },
    likes: {
        'type': Number,
        default: 0
    },
    status: {
        'type': String,
        enum: ['draft', 'published', 'scheduled', 'private'],
        default: 'draft'
    },
    publishedAt: {
        'type': Date,
        default: null
    },
    scheduledFor: {
        'type': Date,
        default: null
    },
    newsletterSent: {
        'type': Boolean,
        default: false
    },
    newsletterSentAt: {
        'type': Date,
        default: null
    },
    isFeatured: {
        'type': Boolean,
        default: false
    },
    metaDescription: {
        'type': String,
        required: false,
        maxlength: 250,
        trim: true
    },
    focusKeywords: {
        'type': String,
        required: false,
        trim: true
    }
}, {
    timestamps: true
})


export const BlogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);