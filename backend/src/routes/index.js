const express = require('express');
const router = express.Router();

const authRoutes       = require('./auth.routes');
const classRoutes      = require('./class.routes');
const profileRoutes    = require('./profile.routes');
const enrollmentRoutes = require('./enrollment.routes');
const encuestaRoutes   = require('./encuesta.routes');
const examenRoutes     = require('./examen.routes');

// Ruta de prueba
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

router.use('/auth',                  authRoutes);
router.use('/classes',               classRoutes);
router.use('/classes/:id/students',  enrollmentRoutes);
router.use('/profile',               profileRoutes);
router.use('/encuestas',             encuestaRoutes);
router.use('/examenes',              examenRoutes);

module.exports = router;

// Made with Bob
