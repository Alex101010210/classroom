const jwt = require('jsonwebtoken');
const config = require('../config/env');

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Acceso denegado. No se proporcionó token de autenticación.' 
      });
    }

    // Verificar el token
    jwt.verify(token, config.jwt.secret, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          message: 'Token inválido o expirado.' 
        });
      }

      // Agregar la información del usuario al request
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error en la autenticación.',
      error: error.message 
    });
  }
};

// Middleware para verificar que el usuario sea maestro
const requireTeacher = (req, res, next) => {
  if (req.user.rol !== 'maestro') {
    return res.status(403).json({ 
      message: 'Acceso denegado. Solo los maestros pueden realizar esta acción.' 
    });
  }
  next();
};

// Middleware para verificar que el usuario sea alumno
const requireStudent = (req, res, next) => {
  if (req.user.rol !== 'alumno') {
    return res.status(403).json({ 
      message: 'Acceso denegado. Solo los alumnos pueden realizar esta acción.' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireTeacher,
  requireStudent
};

// Made with Bob
