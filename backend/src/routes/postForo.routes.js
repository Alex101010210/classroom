const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :foroId
const postForoController = require('../controllers/postForoController');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// GET  /api/foros/:foroId/posts  - Listar posts del foro
router.get('/', postForoController.getPosts);

// POST /api/foros/:foroId/posts  - Crear post
router.post('/', postForoController.createPost);

// DELETE /api/foros/:foroId/posts/:postId - Eliminar post
router.delete('/:postId', postForoController.deletePost);

module.exports = router;

// Made with Bob
