import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'spam'],
    default: 'approved' // Auto-approve for now, can be changed to 'pending' later
  },
  moderationNote: {
    type: String,
    default: ''
  },
  moderatedAt: {
    type: Date,
    default: null
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // For future user authentication
    default: null
  },
  ipAddress: {
    type: String,
    default: null // For future spam detection
  },
  userAgent: {
    type: String,
    default: null // For future spam detection
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;
