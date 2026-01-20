// index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { sequelize, ensureDatabaseExists } = require('./config/database');
const User = require('./models/User');
const Booking = require('./models/Booking');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { seedAdminUser } = require('./seed/adminUser');

const app = express();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const PORT = Number.parseInt(process.env.PORT, 10) || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

requireEnv('DB_NAME');
requireEnv('DB_USER');
requireEnv('DB_PASSWORD');
requireEnv('JWT_SECRET');

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (origin === CLIENT_ORIGIN) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '100kb' }));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'DharaBatti API running' });
});

// Associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((req, res) => {
  return res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const message = err && err.message ? err.message : 'Internal server error';
  const status = message === 'Not allowed by CORS' ? 403 : 500;
  if (status === 500) {
    console.error('Unhandled server error:', err);
  }
  return res.status(status).json({ message });
});

const startServer = async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync();
    console.log('Models synchronized.');

    await seedAdminUser();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Allowed CORS origin: ${CLIENT_ORIGIN}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

startServer();