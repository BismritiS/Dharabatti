// models/Booking.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define(
  'Booking',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: true,
      validate: { isEmail: true },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    serviceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    urgency: {
      type: DataTypes.ENUM('standard', 'same_day', 'emergency'),
      allowNull: false,
      defaultValue: 'standard',
    },
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    timeSlot: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Completed', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    amount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    providerName: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
  },
  {
    tableName: 'bookings',
    indexes: [
      { fields: ['userId'] },
      { fields: ['status'] },
      { fields: ['serviceType'] },
    ],
  }
);

module.exports = Booking;