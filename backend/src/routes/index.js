const express = require('express');
const router = express.Router();

// Importar rutas cuando estén listas
const authRoutes = require('./auth.routes');
const classRoutes = require('./class.routes');
// const pollRoutes = require('./poll.routes');
// const analyticsRoutes = require('./analytics.routes');

// Ruta de prueba
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Usar rutas cuando estén listas
router.use('/auth', authRoutes);
router.use('/classes', classRoutes);
// router.use('/polls', pollRoutes);
// router.use('/analytics', analyticsRoutes);

module.exports = router;

// Made with Bob
