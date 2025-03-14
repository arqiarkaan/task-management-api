const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama wajib diisi'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Email tidak valid',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: 6,
    select: false,
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

module.exports = mongoose.model('User', UserSchema);
