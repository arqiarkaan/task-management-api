const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Check if project exists
    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan',
      });
    }

    // Check if user is authorized to add task to this project
    if (
      req.user.role !== 'admin' &&
      project.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Tidak diizinkan untuk menambahkan tugas ke proyek ini',
      });
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat tugas',
      error: error.message,
    });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    // Build query
    let query;

    // Filter by project if specified
    if (req.query.project) {
      query = { project: req.query.project };
    }

    // Filter by user if not admin
    if (req.user.role !== 'admin') {
      // If user is not admin, they can only see tasks they're assigned to
      // or tasks in projects they created
      const projects = await Project.find({ createdBy: req.user.id });
      const projectIds = projects.map((project) => project._id);

      query = {
        $or: [{ assignedTo: req.user.id }, { project: { $in: projectIds } }],
      };
    }

    const tasks = await Task.find(query)
      .populate({
        path: 'project',
        select: 'name description',
      })
      .populate({
        path: 'assignedTo',
        select: 'name email avatar',
      })
      .populate({
        path: 'createdBy',
        select: 'name email avatar',
      });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan daftar tugas',
      error: error.message,
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate({
        path: 'project',
        select: 'name description',
      })
      .populate({
        path: 'assignedTo',
        select: 'name email avatar',
      })
      .populate({
        path: 'createdBy',
        select: 'name email avatar',
      });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tugas tidak ditemukan',
      });
    }

    // Check if user is authorized to view this task
    if (
      req.user.role !== 'admin' &&
      task.assignedTo._id.toString() !== req.user.id &&
      task.createdBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Tidak diizinkan untuk melihat tugas ini',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan tugas',
      error: error.message,
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tugas tidak ditemukan',
      });
    }

    // Check if user is authorized to update this task
    if (
      req.user.role !== 'admin' &&
      task.assignedTo.toString() !== req.user.id &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Tidak diizinkan untuk mengubah tugas ini',
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui tugas',
      error: error.message,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tugas tidak ditemukan',
      });
    }

    // Check if user is authorized to delete this task
    if (
      req.user.role !== 'admin' &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Tidak diizinkan untuk menghapus tugas ini',
      });
    }

    await task.remove();

    res.status(200).json({
      success: true,
      message: 'Tugas berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus tugas',
      error: error.message,
    });
  }
};