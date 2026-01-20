// routes/userRoutes.js
const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

const createUserValidators = [
  body('fullName')
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage('Full name must be 3–100 characters.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.'),
  body('phone')
    .optional()
    .isLength({ min: 7, max: 20 })
    .withMessage('Phone must be 7–20 characters.'),
  body('role')
    .optional()
    .isIn(['customer', 'provider', 'admin'])
    .withMessage('Invalid role.'),
];

const updateUserValidators = [
  body('fullName')
    .optional()
    .isString()
    .isLength({ min: 3, max: 100 }),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 8 }),
  body('phone').optional().isLength({ min: 7, max: 20 }),
  body('role').optional().isIn(['customer', 'provider', 'admin']),
  body('isActive').optional().isBoolean(),
];

// Public registration endpoint (no auth)
// Non-admins cannot create admin (enforced in controller)
router.post('/', createUserValidators, userController.createUser);

// Admin-only management endpoints
router.get(
  '/',
  authenticate,
  requireRole('admin'),
  userController.getUsers
);

router.get(
  '/:id',
  authenticate,
  requireRole('admin'),
  userController.getUserById
);

router.put(
  '/:id',
  authenticate,
  requireRole('admin'),
  updateUserValidators,
  userController.updateUser
);

// routes/userRoutes.js
router.delete(
  '/:id',
  authenticate,
  requireRole('admin'),
  userController.deleteUser
);

module.exports = router;