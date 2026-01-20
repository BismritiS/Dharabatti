// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [3, 100],
          msg: 'Full name must be between 3 and 100 characters.',
        },
      },
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid email format.',
        },
        len: {
          args: [5, 120],
          msg: 'Email must be between 5 and 120 characters.',
        },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: {
          args: [7, 20],
          msg: 'Phone number must be between 7 and 20 characters.',
        },
      },
    },
    role: {
      type: DataTypes.ENUM('customer', 'provider', 'admin'),
      allowNull: false,
      defaultValue: 'customer',
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'users',
    indexes: [
      { unique: true, fields: ['email'] },
      { fields: ['role'] },
      { fields: ['isActive'] },
    ],
  }
);

// Hide sensitive data when converting to JSON
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.passwordHash;
  return values;
};

module.exports = User;