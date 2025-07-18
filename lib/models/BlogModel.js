import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        'type': String,
        required: true
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
        enum: ['published', 'draft', 'scheduled'],
        default: 'published'
    },
    newsletterSent: {
        'type': Boolean,
        default: false
    },
    newsletterSentAt: {
        'type': Date,
        default: null
    }
}, {
    timestamps: true
})


export const BlogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);