const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth.middleware');

// GET /api/profile — obtener perfil del usuario autenticado
router.get('/', authenticateToken, profileController.getProfile);

// PUT /api/profile — actualizar campos opcionales del perfil
router.put('/', authenticateToken, profileController.updateProfile);

module.exports = router;

// Made with Bob
