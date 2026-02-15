const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      sparse: true,  // ADD THIS LINE
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: String,
    author: {
      type: String,
      default: 'Yasith Yuran',
    },
    featured_image: String,
    tags: [String],
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogPost', blogPostSchema);