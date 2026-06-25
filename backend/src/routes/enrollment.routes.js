const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams para acceder a :id del padre
const enrollmentController = require('../controllers/enrollmentController');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// GET  /api/classes/:id/students       — listar alumnos inscritos
router.get('/', enrollmentController.getStudents);

// POST /api/classes/:id/students       — inscribir alumno (body: { email })
router.post('/', enrollmentController.enrollStudent);

// DELETE /api/classes/:id/students/:alumno_id — dar de baja al alumno
router.delete('/:alumno_id', enrollmentController.removeStudent);

module.exports = router;

// Made with Bob
