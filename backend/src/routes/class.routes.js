const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticateToken } = require('../middleware/auth.middleware');

// NOTA: Temporalmente sin autenticación para pruebas
// Descomentar la siguiente línea cuando tengas el sistema de login funcionando:
// router.use(authenticateToken);

// POST /api/classes - Crear nueva clase
router.post('/', classController.createClass);

// GET /api/classes - Obtener todas las clases del maestro
router.get('/', classController.getTeacherClasses);

// GET /api/classes/:id - Obtener una clase específica
router.get('/:id', classController.getClassById);

// PUT /api/classes/:id - Actualizar clase
router.put('/:id', classController.updateClass);

// DELETE /api/classes/:id - Eliminar clase (soft delete)
router.delete('/:id', classController.deleteClass);

module.exports = router;

// Made with Bob
