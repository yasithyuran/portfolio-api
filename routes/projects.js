const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET featured projects (MUST come BEFORE /:id route!)
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).limit(3).sort({ createdAt: -1 });
    console.log('✅ Featured projects fetched:', projects.length);
    res.json(projects);
  } catch (error) {
    console.error('❌ Error fetching featured projects:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET single project (comes AFTER /featured)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE project (admin only)
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

// UPDATE project (admin only)
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

// DELETE project (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    console.log('✅ Project deleted:', project._id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('❌ Error deleting project:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;