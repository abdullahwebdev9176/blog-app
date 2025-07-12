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
    image: {
        'type': String,
        required: true
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
    }
})


export const BlogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);