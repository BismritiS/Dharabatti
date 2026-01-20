// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize, ensureDatabaseExists } = require('./config/database');
const User = require('./models/User');
const Booking = require('./models/Booking');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { seedAdminUser } = require('./seed/adminUser');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'DharaBatti API running' });
});

// Associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

const startServer = async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync();
    console.log('Models synchronized.');

    await seedAdminUser();

    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

startServer();