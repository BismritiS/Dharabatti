// routes/serviceRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

// Validation rules
const serviceValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Description is required'),
  body('icon')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Icon must be maximum 10 characters'),
  body('badge')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Badge must be maximum 50 characters'),
  body('basePrice')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Base price must be a non-negative integer'),
  body('duration')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Duration must be maximum 50 characters'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
];

// Public routes
router.get('/', getServices);
router.get('/:id', getServiceById);

// Admin only routes
router.post('/', authenticate, requireRole('admin'), serviceValidation, createService);
router.put('/:id', authenticate, requireRole('admin'), serviceValidation, updateService);
router.delete('/:id', authenticate, requireRole('admin'), deleteService);

module.exports = router;
