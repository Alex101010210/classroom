const express = require('express');
const router = express.Router();
const foroController = require('../controllers/foroController');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// GET    /api/foros          - Listar todos los foros
router.get('/', foroController.getForos);

// POST   /api/foros          - Crear foro
router.post('/', foroController.createForo);

// GET    /api/foros/:foroId  - Obtener un foro
router.get('/:foroId', foroController.getForoById);

// DELETE /api/foros/:foroId  - Eliminar foro
router.delete('/:foroId', foroController.deleteForo);

module.exports = router;

// Made with Bob
