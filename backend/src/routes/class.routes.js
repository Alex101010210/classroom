const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const enrollmentController = require('../controllers/enrollmentController');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// POST /api/classes - Crear nueva clase
router.post('/', classController.createClass);

// GET /api/classes/my-classes - Clases en las que está inscrito el alumno autenticado
// GET /api/classes/student    - alias del remoto (ambos apuntan al mismo handler)
// IMPORTANTE: deben estar antes de /:id
router.get('/my-classes', enrollmentController.getMyClasses);
router.get('/student',    enrollmentController.getMyClasses);

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
