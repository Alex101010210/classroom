const express = require('express');
const router = express.Router();

const authRoutes           = require('./auth.routes');
const classRoutes          = require('./class.routes');
const profileRoutes        = require('./profile.routes');
const enrollmentRoutes     = require('./enrollment.routes');
const encuestaRoutes       = require('./encuesta.routes');
const examenRoutes         = require('./examen.routes');
const pollRoutes           = require('./poll.routes');
const taskRoutes           = require('./task.routes');
const { authenticateToken } = require('../middleware/auth.middleware');
const respuestasController = require('../controllers/respuestasController');
const foroRoutes = require('./foro.routes');
const postForoRoutes = require('./postForo.routes');
// const analyticsRoutes = require('./analytics.routes');

// Ruta de prueba
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Usar rutas cuando estén listas
router.use('/auth',                     authRoutes);
router.use('/classes',                  classRoutes);
router.use('/classes/:id/students',     enrollmentRoutes);
router.use('/profile',                  profileRoutes);
router.use('/polls',                    pollRoutes);
router.use('/classes/:classId/tasks',   taskRoutes);
router.use('/foros',                    foroRoutes);
router.use('/foros/:foroId/posts',      postForoRoutes);
// router.use('/analytics', analyticsRoutes);
router.use('/encuestas',               encuestaRoutes);
router.use('/examenes',                examenRoutes);

// GET /api/mis-resultados — historial del alumno autenticado
router.get('/mis-resultados', authenticateToken, respuestasController.getMisResultados);

module.exports = router;

// Made with Bob
