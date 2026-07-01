const express = require('express');
const router = express.Router();
const encuestaController = require('../controllers/encuestaController');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// POST   /api/encuestas                    — crear
router.post('/', encuestaController.createEncuesta);

// GET    /api/encuestas/clase/:clase_id    — listar (maestro) — debe ir ANTES de /:id
router.get('/clase/:clase_id', encuestaController.getEncuestasByClase);

// GET    /api/encuestas/alumno/:clase_id   — listar (alumno) — debe ir ANTES de /:id
router.get('/alumno/:clase_id', encuestaController.getEncuestasByClaseAlumno);

// GET    /api/encuestas/:id                — obtener por id
router.get('/:id', encuestaController.getEncuestaById);

// PUT    /api/encuestas/:id                — actualizar
router.put('/:id', encuestaController.updateEncuesta);

// DELETE /api/encuestas/:id                — eliminar
router.delete('/:id', encuestaController.deleteEncuesta);

module.exports = router;

// Made with Bob
