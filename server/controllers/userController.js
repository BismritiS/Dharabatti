// controllers/userController.js
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// POST /api/users  (Create user)
exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, phone, role, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // determine final role
    let finalRole = role || 'customer';
    
    // if not admin, never allow creating an admin account
    if (!req.user || req.user.role !== 'admin') {
      if (finalRole === 'admin') {
        finalRole = 'customer';
      }
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      role: finalRole,
      passwordHash,
    });

    return res.status(201).json(user);
  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/users  (List users with pagination + filters)
exports.getUsers = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.role) where.role = req.query.role;
    if (req.query.isActive !== undefined) {
      where.isActive = req.query.isActive === 'true';
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return res.json({
      data: rows,
      page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (err) {
    console.error('Get users error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/users/:id  (Get single user)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json(user);
  } catch (err) {
    console.error('Get user by ID error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/users/:id  (Update user)
exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { fullName, email, phone, role, password, isActive } = req.body;

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ message: 'Email already in use.' });
      }
      user.email = email;
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.json(user);
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/users/:id  (Soft delete: deactivate user)
// controllers/userController.js
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Soft delete: just mark inactive
    user.isActive = false;
    await user.save();

    return res.json({
      message: 'User deactivated successfully.',
      user: user.toJSON(),
    });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};