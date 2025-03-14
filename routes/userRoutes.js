// routes/userRoutes.js
const express = require('express');
const {
  registerUser,
  login,
  getMe,
  updateDetails,
  deleteUser,
  getUsers,
  getUserById,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', upload.single('avatar'), registerUser);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('avatar'), updateDetails);
router.delete('/me', protect, deleteUser);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUserById);

module.exports = router;
