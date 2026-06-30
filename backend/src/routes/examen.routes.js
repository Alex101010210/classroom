const express = require('express');
const router = express.Router();
const examenController = require('../controllers/examenController');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// POST   /api/examenes                    — crear
router.post('/', examenController.createExamen);

// GET    /api/examenes/clase/:clase_id    — listar (maestro) — debe ir ANTES de /:id
router.get('/clase/:clase_id', examenController.getExamenesByClase);

// GET    /api/examenes/alumno/:clase_id   — listar (alumno) — debe ir ANTES de /:id
router.get('/alumno/:clase_id', examenController.getExamenesByClaseAlumno);

// GET    /api/examenes/:id                — obtener por id
router.get('/:id', examenController.getExamenById);

// PUT    /api/examenes/:id                — actualizar
router.put('/:id', examenController.updateExamen);

// DELETE /api/examenes/:id                — eliminar
router.delete('/:id', examenController.deleteExamen);

module.exports = router;

// Made with Bob
