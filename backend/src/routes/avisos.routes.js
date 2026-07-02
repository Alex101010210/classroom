const express = require('express');
const router = express.Router({ mergeParams: true });
const avisosController = require('../controllers/avisosController');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// GET    /api/classes/:classId/avisos           — leer avisos (maestro y alumno)
router.get('/', avisosController.getAvisos);

// POST   /api/classes/:classId/avisos           — crear aviso (maestro)
router.post('/', avisosController.createAviso);

// DELETE /api/classes/:classId/avisos/:avisoId  — eliminar aviso (maestro)
router.delete('/:avisoId', avisosController.deleteAviso);

module.exports = router;
