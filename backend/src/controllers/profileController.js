const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

// Obtener el perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Datos base del usuario (no sensibles)
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'email', 'nombre', 'apellido']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Datos opcionales del perfil (puede no existir aún)
    const infoUsuario = await UserProfile.findOne({
      where: { id_usuario: userId }
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: infoUsuario?.telefono || null,
        departamento: infoUsuario?.departamento || null,
        biografia: infoUsuario?.biografia || null
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil',
      error: error.message
    });
  }
};

// Actualizar los campos opcionales del perfil
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { telefono, departamento, biografia } = req.body;

    // Upsert: crea el registro si no existe, lo actualiza si ya existe
    const [infoUsuario] = await UserProfile.upsert({
      id_usuario: userId,
      telefono: telefono || null,
      departamento: departamento || null,
      biografia: biografia || null
    }, {
      returning: true
    });

    // Recuperar datos del usuario para devolver respuesta completa
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'email', 'nombre', 'apellido']
    });

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: infoUsuario.telefono,
        departamento: infoUsuario.departamento,
        biografia: infoUsuario.biografia
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil',
      error: error.message
    });
  }
};

// Made with Bob
