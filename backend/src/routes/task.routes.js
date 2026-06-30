const express = require('express');
const router = express.Router({ mergeParams: true });
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// GET    /api/classes/:classId/tasks       - Listar tareas de una clase
router.get('/', taskController.getTasksByClass);

// POST   /api/classes/:classId/tasks       - Crear tarea
router.post('/', taskController.createTask);

// GET    /api/classes/:classId/tasks/:taskId  - Obtener una tarea
router.get('/:taskId', taskController.getTaskById);

// PUT    /api/classes/:classId/tasks/:taskId  - Actualizar tarea
router.put('/:taskId', taskController.updateTask);

// DELETE /api/classes/:classId/tasks/:taskId  - Eliminar tarea
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;

// Made with Bob
