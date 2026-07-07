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
const avisosRoutes         = require('./avisos.routes');
const foroRoutes           = require('./foro.routes');
const postForoRoutes       = require('./postForo.routes');
const analyticsRoutes      = require('./analytics.routes');
const { authenticateToken } = require('../middleware/auth.middleware');
const respuestasController = require('../controllers/respuestasController');

// Ruta de prueba
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

router.use('/auth',                      authRoutes);
router.use('/classes',                   classRoutes);
router.use('/classes/:id/students',      enrollmentRoutes);
router.use('/classes/:classId/tasks',    taskRoutes);
router.use('/classes/:classId/avisos',   avisosRoutes);
router.use('/profile',                   profileRoutes);
router.use('/polls',                     pollRoutes);
router.use('/encuestas',                 encuestaRoutes);
router.use('/examenes',                  examenRoutes);
router.use('/foros',                     foroRoutes);
router.use('/analytics',                 analyticsRoutes);
router.use('/foros/:foroId/posts',       postForoRoutes);

// GET /api/mis-resultados — historial del alumno autenticado
router.get('/mis-resultados', authenticateToken, respuestasController.getMisResultados);

module.exports = router;
