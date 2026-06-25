const Enrollment = require('../models/Enrollment');
const Class = require('../models/Class');
const User = require('../models/User');

// GET /api/classes/:id/students
// Retorna los alumnos activos inscritos en una clase del maestro autenticado
exports.getStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const maestro_id = req.user.id;

    // Verificar que la clase pertenece al maestro
    const classData = await Class.findOne({ where: { id, maestro_id } });
    if (!classData) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    // Obtener inscripciones activas con datos del alumno
    const enrollments = await Enrollment.findAll({
      where: { clase_id: id, activa: true }
    });

    // Obtener ids únicos de alumnos
    const alumnoIds = enrollments.map(e => e.alumno_id);

    const students = await User.findAll({
      where: { id: alumnoIds, rol: 1 },
      attributes: ['id', 'nombre', 'apellido', 'email']
    });

    // Combinar para incluir fecha de inscripción
    const result = students.map(student => {
      const enrollment = enrollments.find(e => e.alumno_id === student.id);
      return {
        id: student.id,
        nombre: student.nombre,
        apellido: student.apellido,
        email: student.email,
        fechaInscripcion: enrollment ? enrollment.fechaInscripcion : null,
        inscripcion_id: enrollment ? enrollment.id : null
      };
    });

    res.json({ students: result });
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    res.status(500).json({ message: 'Error al obtener los alumnos', error: error.message });
  }
};

// POST /api/classes/:id/students
// Inscribe un alumno en la clase usando su email
exports.enrollStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const maestro_id = req.user.id;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'El email del alumno es requerido' });
    }

    // Verificar que la clase pertenece al maestro
    const classData = await Class.findOne({ where: { id, maestro_id } });
    if (!classData) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    // Buscar al alumno por email
    const student = await User.findOne({ where: { email: email.trim(), rol: 1, activo: true } });
    if (!student) {
      return res.status(404).json({ message: 'No se encontró un alumno con ese email' });
    }

    // Verificar si ya está inscrito activamente
    const existing = await Enrollment.findOne({
      where: { clase_id: id, alumno_id: student.id, activa: true }
    });
    if (existing) {
      return res.status(409).json({ message: 'El alumno ya está inscrito en esta clase' });
    }

    // Si existe una inscripción inactiva, reactivarla
    const inactive = await Enrollment.findOne({
      where: { clase_id: id, alumno_id: student.id, activa: false }
    });
    if (inactive) {
      await inactive.update({ activa: true, fechaInscripcion: new Date() });
      return res.status(201).json({
        message: 'Alumno inscrito exitosamente',
        student: {
          id: student.id,
          nombre: student.nombre,
          apellido: student.apellido,
          email: student.email,
          fechaInscripcion: inactive.fechaInscripcion,
          inscripcion_id: inactive.id
        }
      });
    }

    // Crear nueva inscripción
    const enrollment = await Enrollment.create({
      clase_id: id,
      alumno_id: student.id,
      activa: true
    });

    res.status(201).json({
      message: 'Alumno inscrito exitosamente',
      student: {
        id: student.id,
        nombre: student.nombre,
        apellido: student.apellido,
        email: student.email,
        fechaInscripcion: enrollment.fechaInscripcion,
        inscripcion_id: enrollment.id
      }
    });
  } catch (error) {
    console.error('Error al inscribir alumno:', error);
    res.status(500).json({ message: 'Error al inscribir al alumno', error: error.message });
  }
};

// DELETE /api/classes/:id/students/:alumno_id
// Soft-delete: marca la inscripción como inactiva
exports.removeStudent = async (req, res) => {
  try {
    const { id, alumno_id } = req.params;
    const maestro_id = req.user.id;

    // Verificar que la clase pertenece al maestro
    const classData = await Class.findOne({ where: { id, maestro_id } });
    if (!classData) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    const enrollment = await Enrollment.findOne({
      where: { clase_id: id, alumno_id, activa: true }
    });
    if (!enrollment) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    await enrollment.update({ activa: false });

    res.json({ message: 'Alumno eliminado de la clase exitosamente' });
  } catch (error) {
    console.error('Error al eliminar alumno:', error);
    res.status(500).json({ message: 'Error al eliminar al alumno', error: error.message });
  }
};

// Made with Bob
