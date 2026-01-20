// models/Service.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define(
  'Service',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: '🔧',
    },
    badge: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    basePrice: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: 'Base price in rupees',
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Typical duration (e.g., "1-2 hours")',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'services',
    indexes: [
      { fields: ['category'] },
      { fields: ['isActive'] },
      { fields: ['sortOrder'] },
    ],
  }
);

module.exports = Service;
