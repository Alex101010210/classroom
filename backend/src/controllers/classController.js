const Class = require('../models/Class');
const Enrollment = require('../models/Enrollment');
const { sequelize } = require('../config/db');

// Crear nueva clase (INSERT)
exports.createClass = async (req, res) => {
  try {
    const { nombre_class, descrip_class, color_class } = req.body;
    // TEMPORAL: usar maestro_id = 1 para pruebas sin autenticación
    const maestro_id = req.user.id;

    // Validación básica
    if (!nombre_class || nombre_class.trim() === '') {
      return res.status(400).json({
        message: 'El nombre de la clase es requerido'
      });
    }

    // Insertar en la base de datos
    const newClass = await Class.create({
      maestro_id,
      nombre_class: nombre_class.trim(),
      descrip_class: descrip_class ? descrip_class.trim() : null,
      color_class: color_class || '#3b82f6',
      activa_class: true
    });

    res.status(201).json({
      message: 'Clase creada exitosamente',
      class: newClass
    });
  } catch (error) {
    console.error('Error al crear clase:', error);
    res.status(500).json({
      message: 'Error al crear la clase',
      error: error.message
    });
  }
};

// Obtener todas las clases del maestro (SELECT)
exports.getTeacherClasses = async (req, res) => {
  try {
    const maestro_id = req.user.id;

    const classes = await Class.findAll({
      where: { maestro_id, activa_class: true },
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM inscripciones WHERE inscripciones.clase_id = "Class".id AND inscripciones.activa = true)`
            ),
            'student_count'
          ]
        ]
      },
      order: [['id', 'DESC']]
    });

    res.json({ classes });
  } catch (error) {
    console.error('Error al obtener clases:', error);
    res.status(500).json({
      message: 'Error al obtener las clases',
      error: error.message
    });
  }
};

// Obtener una clase específica por ID
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const maestro_id =  req.user.id;

    const classData = await Class.findOne({
      where: {
        id,
        maestro_id
      }
    });

    if (!classData) {
      return res.status(404).json({
        message: 'Clase no encontrada'
      });
    }

    res.json({
      class: classData
    });
  } catch (error) {
    console.error('Error al obtener clase:', error);
    res.status(500).json({
      message: 'Error al obtener la clase',
      error: error.message
    });
  }
};

// Actualizar clase
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_class, descrip_class, color_class } = req.body;
    const maestro_id = req.user.id;

    const classData = await Class.findOne({
      where: { id, maestro_id }
    });

    if (!classData) {
      return res.status(404).json({
        message: 'Clase no encontrada'
      });
    }

    await classData.update({
      nombre_class: nombre_class || classData.nombre_class,
      descrip_class: descrip_class !== undefined ? descrip_class : classData.descrip_class,
      color_class: color_class || classData.color_class
    });

    res.json({
      message: 'Clase actualizada exitosamente',
      class: classData
    });
  } catch (error) {
    console.error('Error al actualizar clase:', error);
    res.status(500).json({
      message: 'Error al actualizar la clase',
      error: error.message
    });
  }
};

// Eliminar clase (soft delete - cambiar activa_class a false)
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const maestro_id = req.user ? req.user.id : 1;

    const classData = await Class.findOne({
      where: { id, maestro_id }
    });

    if (!classData) {
      return res.status(404).json({
        message: 'Clase no encontrada'
      });
    }

    await classData.update({ activa_class: false });

    res.json({
      message: 'Clase eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar clase:', error);
    res.status(500).json({
      message: 'Error al eliminar la clase',
      error: error.message
    });
  }
};

// Obtener las clases donde el alumno autenticado está inscrito
exports.getStudentClasses = async (req, res) => {
  try {
    const alumno_id = req.user.id;

    const enrollments = await Enrollment.findAll({
      where: { alumno_id, activa: true }
    });

    const claseIds = enrollments.map(e => e.clase_id);

    if (claseIds.length === 0) {
      return res.json({ classes: [] });
    }

    const classes = await Class.findAll({
      where: { id: claseIds, activa_class: true },
      order: [['id', 'DESC']]
    });

    res.json({ classes });
  } catch (error) {
    console.error('Error al obtener clases del alumno:', error);
    res.status(500).json({ message: 'Error al obtener las clases', error: error.message });
  }
};

// Made with Bob
