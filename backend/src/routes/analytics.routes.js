const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// GET /api/analytics/encuesta/:encuestaId        — estadísticas agregadas
router.get('/encuesta/:encuestaId', analyticsController.getEncuestaStats);

// GET /api/analytics/encuesta/:encuestaId/csv    — exportar CSV
router.get('/encuesta/:encuestaId/csv', analyticsController.exportEncuestaCsv);

module.exports = router;

// Made with Bob
