// controllers/bookingController.js
const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id; // from JWT
    const {
      fullName,
      phone,
      email,
      address,
      city,
      serviceType,
      urgency,
      scheduledDate,
      timeSlot,
      description,
    } = req.body;

    const booking = await Booking.create({
      userId,
      fullName,
      phone,
      email,
      address,
      city,
      serviceType,
      urgency,
      scheduledDate: scheduledDate || null,
      timeSlot,
      description,
      status: 'Pending',
    });

    return res.status(201).json(booking);
  } catch (err) {
    console.error('Create booking error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    return res.json({ data: bookings });
  } catch (err) {
    console.error('Get my bookings error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Optional: admin view of all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.json({ data: bookings });
  } catch (err) {
    console.error('Get all bookings error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};