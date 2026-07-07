const express = require('express');
const router = express.Router();
const encuestaController = require('../controllers/encuestaController');
const respuestasController = require('../controllers/respuestasController');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// POST   /api/encuestas                       — crear
router.post('/', encuestaController.createEncuesta);

// GET    /api/encuestas/clase/:clase_id        — listar (maestro) — debe ir ANTES de /:id
router.get('/clase/:clase_id', encuestaController.getEncuestasByClase);

// GET    /api/encuestas/alumno/:clase_id       — listar (alumno) — debe ir ANTES de /:id
router.get('/alumno/:clase_id', encuestaController.getEncuestasByClaseAlumno);

// GET    /api/encuestas/:id/check              — alumno verifica si ya respondió — debe ir ANTES de /:id
router.get('/:id/check', respuestasController.checkEncuesta);

// POST   /api/encuestas/:id/responses          — alumno envía respuestas — debe ir ANTES de /:id
router.post('/:id/responses', respuestasController.submitEncuesta);

// GET    /api/encuestas/:id/responses          — maestro ve respuestas — debe ir ANTES de /:id
router.get('/:id/responses', respuestasController.getEncuestaResponses);

// GET    /api/encuestas/:id                    — obtener por id — siempre al final
router.get('/:id', encuestaController.getEncuestaById);

// PUT    /api/encuestas/:id                    — actualizar
router.put('/:id', encuestaController.updateEncuesta);

// DELETE /api/encuestas/:id                    — eliminar
router.delete('/:id', encuestaController.deleteEncuesta);

module.exports = router;

// Made with Bob
