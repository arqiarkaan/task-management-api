const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat proyek',
      error: error.message,
    });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    let query;
    if (req.user.role !== 'admin') {
      query = { createdBy: req.user.id };
    }

    const projects = await Project.find(query).populate({
      path: 'createdBy',
      select: 'name email avatar',
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan daftar proyek',
      error: error.message,
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate({
      path: 'createdBy',
      select: 'name email avatar',
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan',
      });
    }

    if (
      req.user.role !== 'admin' &&
      project.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Tidak diizinkan untuk melihat proyek ini',
      });
    }

    const tasks = await Task.find({ project: project._id }).populate({
      path: 'assignedTo',
      select: 'name email avatar',
    });

    res.status(200).json({
      success: true,
      data: {
        project,
        tasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan proyek',
      error: error.message,
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan',
      });
    }

    if (
      req.user.role !== 'admin' &&
      project.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Tidak diizinkan untuk mengubah proyek ini',
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui proyek',
      error: error.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan',
      });
    }

    if (
      req.user.role !== 'admin' &&
      project.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Tidak diizinkan untuk menghapus proyek ini',
      });
    }

    await Task.deleteMany({ project: req.params.id });

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Proyek berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus proyek',
      error: error.message,
    });
  }
};
