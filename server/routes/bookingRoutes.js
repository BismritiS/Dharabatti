// routes/bookingRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

const createBookingValidators = [
  body('fullName')
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage('Full name must be 3–100 characters.'),
  body('phone')
    .isString()
    .isLength({ min: 7, max: 20 })
    .withMessage('Phone must be 7–20 characters.'),
  body('email').optional().isEmail().withMessage('Invalid email.'),
  body('address')
    .isString()
    .isLength({ min: 5, max: 255 })
    .withMessage('Address must be 5–255 characters.'),
  body('city')
    .isString()
    .isLength({ min: 2, max: 80 })
    .withMessage('City must be 2–80 characters.'),
  body('serviceType')
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage('Service type is required.'),
  body('urgency')
    .optional()
    .isIn(['standard', 'same_day', 'emergency'])
    .withMessage('Invalid urgency value.'),
  body('description')
    .isString()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters.'),
  body('scheduledDate').optional().isISO8601().toDate(),
  body('timeSlot').optional().isString().isLength({ max: 80 }),
];

// Authenticated user creates booking
router.post(
  '/',
  authenticate,
  createBookingValidators,
  bookingController.createBooking
);

// Authenticated user sees own bookings
router.get('/me', authenticate, bookingController.getMyBookings);

// Admin can see all bookings (optional)
router.get(
  '/',
  authenticate,
  requireRole('admin'),
  bookingController.getAllBookings
);

module.exports = router;