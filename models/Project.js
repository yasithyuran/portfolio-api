const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Web App', 'Mobile', 'UI/UX', 'Graphic Design'],
      required: true,
    },
    technologies: [String],
    images: [String],
    thumbnail: String,
    liveLink: String,
    githubLink: String,
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);