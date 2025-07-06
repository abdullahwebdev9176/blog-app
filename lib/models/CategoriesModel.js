// models/Category.js
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Categories || mongoose.model('Categories', CategorySchema);
