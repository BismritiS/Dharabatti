// seed/services.js
const Service = require('../models/Service');

const DEFAULT_SERVICES = [
  {
    name: 'Electrical',
    category: 'electrical',
    description: 'Wiring, fixtures, power backup, safety inspections and troubleshooting.',
    icon: '💡',
    badge: 'Popular in apartments',
    basePrice: 500,
    duration: '1-2 hours',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'Plumbing',
    category: 'plumbing',
    description: 'Leak repair, pipe fitting, bathroom/kitchen fixtures & drain cleaning.',
    icon: '🚿',
    badge: 'Emergency support',
    basePrice: 600,
    duration: '1-3 hours',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'Home Cleaning',
    category: 'cleaning',
    description: 'Deep cleaning, move-in/move-out, sofa & carpet cleaning.',
    icon: '🧹',
    badge: 'Trusted staff',
    basePrice: 800,
    duration: '2-4 hours',
    sortOrder: 3,
    isActive: true,
  },
  {
    name: 'Painting',
    category: 'painting',
    description: 'Interior & exterior painting, waterproofing, touch-ups & renovations.',
    icon: '🎨',
    badge: 'Free color consult',
    basePrice: 1200,
    duration: '3-6 hours',
    sortOrder: 4,
    isActive: true,
  },
  {
    name: 'AC & Cooling',
    category: 'ac',
    description: 'AC service, gas refill, installation, seasonal maintenance & more.',
    icon: '❄️',
    badge: 'Seasonal demand',
    basePrice: 700,
    duration: '1-2 hours',
    sortOrder: 5,
    isActive: true,
  },
  {
    name: 'Others',
    category: 'other',
    description: 'Carpentry, minor repairs, handyman tasks customized to your space.',
    icon: '🧰',
    badge: 'Custom jobs',
    basePrice: 400,
    duration: '1-3 hours',
    sortOrder: 6,
    isActive: true,
  },
];

async function seedServices() {
  try {
    console.log('Seeding services...');
    
    // Check if services already exist
    const existingServices = await Service.findAll();
    if (existingServices.length > 0) {
      console.log('Services already exist, skipping seeding.');
      return;
    }

    // Create services
    await Service.bulkCreate(DEFAULT_SERVICES);
    console.log(`Created ${DEFAULT_SERVICES.length} services.`);
  } catch (error) {
    console.error('Error seeding services:', error);
  }
}

module.exports = { seedServices };
