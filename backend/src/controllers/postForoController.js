const PostForo = require('../models/PostForo');
const User = require('../models/User');

// Obtener todos los posts de un foro (con nombre del autor)
exports.getPosts = async (req, res) => {
  try {
    const { foroId } = req.params;

    const posts = await PostForo.findAll({
      where: { foro_id: foroId },
      order: [['fecha-publicacio', 'ASC']],
      include: [
        {
          model: User,
          as: 'autor',
          attributes: ['id', 'nombre', 'apellido']
        }
      ]
    });

    res.json({ posts });
  } catch (error) {
    console.error('Error al obtener posts del foro:', error);
    res.status(500).json({ message: 'Error al obtener los posts', error: error.message });
  }
};

// Crear post en un foro
exports.createPost = async (req, res) => {
  try {
    const { foroId } = req.params;
    const { contenido } = req.body;

    if (!contenido || contenido.trim() === '') {
      return res.status(400).json({ message: 'El contenido del post es requerido' });
    }

    const newPost = await PostForo.create({
      foro_id: foroId,
      usuario_id: req.user.id,
      contenido: contenido.trim()
    });

    // Devolver el post con datos del autor
    const postConAutor = await PostForo.findByPk(newPost.id, {
      include: [
        {
          model: User,
          as: 'autor',
          attributes: ['id', 'nombre', 'apellido']
        }
      ]
    });

    res.status(201).json({ message: 'Post creado exitosamente', post: postConAutor });
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ message: 'Error al crear el post', error: error.message });
  }
};

// Eliminar post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostForo.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Solo el autor o un maestro pueden eliminar
    if (post.usuario_id !== req.user.id && req.user.rol !== 'maestro') {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este post' });
    }

    await post.destroy();
    res.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ message: 'Error al eliminar el post', error: error.message });
  }
};

// Made with Bob
