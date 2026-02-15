const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects (pinned first)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ pinned: -1, createdAt: -1 }); // Pinned first, then by date
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET featured projects only (for homepage)
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).limit(3);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE project
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    console.log('✅ Project created:', savedProject._id);
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('❌ Error creating project:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// UPDATE project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    console.log('✅ Project updated:', project._id);
    res.json(project);
  } catch (error) {
    console.error('❌ Error updating project:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    console.log('✅ Project deleted:', req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('❌ Error deleting project:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;