// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

// Main Sequelize instance (connects to your app DB)
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST || 'localhost',
  dialect: 'mysql',
  logging: false,
});

// Helper: create DB if it doesn't exist
async function ensureDatabaseExists() {
  const rootSequelize = new Sequelize('mysql', DB_USER, DB_PASSWORD, {
    host: DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  });

  await rootSequelize.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`
  );
  await rootSequelize.close();
}

module.exports = { sequelize, ensureDatabaseExists };