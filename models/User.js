const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      name: String,
      title: String,
      bio: String,
      phone: String,
      location: String,
    },
    heroImage: String,
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      email: String,
    },
    resume: String,
    achievements: {
      projectsCompleted: {
        type: Number,
        default: 0,
      },
      happyClients: {
        type: Number,
        default: 0,
      },
      yearsExperience: {
        type: Number,
        default: 0,
      },
    },
    techStack: [
      {
        skill: String,
        percentage: {
          type: Number,
          default: 50,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);