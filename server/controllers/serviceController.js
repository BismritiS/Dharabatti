// controllers/serviceController.js
const { validationResult } = require('express-validator');
const Service = require('../models/Service');

// POST /api/services  (Create service)
exports.createService = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, description, icon, badge, basePrice, duration, sortOrder } = req.body;

    const service = await Service.create({
      name,
      category,
      description,
      icon: icon || '🔧',
      badge,
      basePrice,
      duration,
      sortOrder: sortOrder || 0,
    });

    return res.status(201).json(service);
  } catch (err) {
    console.error('Create service error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/services  (List all services)
exports.getServices = async (req, res) => {
  try {
    const { includeInactive = 'false' } = req.query;
    const where = {};
    
    if (includeInactive !== 'true') {
      where.isActive = true;
    }

    const services = await Service.findAll({
      where,
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    });

    return res.json({ data: services });
  } catch (err) {
    console.error('Get services error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/services/:id  (Get single service)
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    return res.json(service);
  } catch (err) {
    console.error('Get service by ID error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/services/:id  (Update service)
exports.updateService = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    const { name, category, description, icon, badge, basePrice, duration, isActive, sortOrder } = req.body;

    if (name !== undefined) service.name = name;
    if (category !== undefined) service.category = category;
    if (description !== undefined) service.description = description;
    if (icon !== undefined) service.icon = icon;
    if (badge !== undefined) service.badge = badge;
    if (basePrice !== undefined) service.basePrice = basePrice;
    if (duration !== undefined) service.duration = duration;
    if (isActive !== undefined) service.isActive = isActive;
    if (sortOrder !== undefined) service.sortOrder = sortOrder;

    await service.save();

    return res.json(service);
  } catch (err) {
    console.error('Update service error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/services/:id  (Soft delete: deactivate service)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Soft delete: just mark inactive
    service.isActive = false;
    await service.save();

    return res.json({
      message: 'Service deactivated successfully.',
      service: service.toJSON(),
    });
  } catch (err) {
    console.error('Delete service error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
