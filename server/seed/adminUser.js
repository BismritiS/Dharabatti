// seed/adminUser.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const fullName = process.env.ADMIN_NAME || 'Admin';

  let admin = await User.findOne({ where: { email } });

  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    admin = await User.create({
      fullName,
      email,
      phone: null,
      role: 'admin',
      passwordHash,
      isActive: true,
    });

    console.log(`✅ Admin user created: ${email}`);
  } else {
    console.log('ℹ️ Admin user already exists, skipping seeding.');
  }
}

module.exports = { seedAdminUser };