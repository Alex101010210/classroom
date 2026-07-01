const Examen = require('../models/Examen');
const Class = require('../models/Class');

// POST /api/examenes  — crear examen
exports.createExamen = async (req, res) => {
  try {
    const { clase_id, titulo, descripcion, preguntas, color, deadline, one_attempt } = req.body;
    const maestro_id = req.user.id;

    if (!clase_id || !titulo || !titulo.trim()) {
      return res.status(400).json({ message: 'clase_id y titulo son requeridos' });
    }

    // Verificar que la clase pertenece al maestro
    const clase = await Class.findOne({ where: { id: clase_id, maestro_id, activa_class: true } });
    if (!clase) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    const examen = await Examen.create({
      clase_id,
      maestro_id,
      titulo: titulo.trim(),
      descripcion: descripcion?.trim() || null,
      preguntas: preguntas || [],
      color: color || '#673ab7',
      deadline: deadline || null,
      one_attempt: one_attempt !== undefined ? one_attempt : true,
      activo: true
    });

    res.status(201).json({ examen });
  } catch (error) {
    console.error('Error al crear examen:', error);
    res.status(500).json({ message: 'Error al crear el examen', error: error.message });
  }
};

// PUT /api/examenes/:id  — actualizar examen existente
exports.updateExamen = async (req, res) => {
  try {
    const { id } = req.params;
    const maestro_id = req.user.id;
    const { titulo, descripcion, preguntas, color, deadline, one_attempt } = req.body;

    const examen = await Examen.findOne({ where: { id, maestro_id, activo: true } });
    if (!examen) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }

    await examen.update({
      titulo: titulo?.trim() ?? examen.titulo,
      descripcion: descripcion !== undefined ? descripcion?.trim() || null : examen.descripcion,
      preguntas: preguntas ?? examen.preguntas,
      color: color ?? examen.color,
      deadline: deadline !== undefined ? deadline || null : examen.deadline,
      one_attempt: one_attempt !== undefined ? one_attempt : examen.one_attempt
    });

    res.json({ examen });
  } catch (error) {
    console.error('Error al actualizar examen:', error);
    res.status(500).json({ message: 'Error al actualizar el examen', error: error.message });
  }
};

// GET /api/examenes/:id  — obtener un examen por ID (alumno o maestro)
exports.getExamenById = async (req, res) => {
  try {
    const { id } = req.params;
    const examen = await Examen.findOne({ where: { id, activo: true } });
    if (!examen) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }
    res.json({ examen });
  } catch (error) {
    console.error('Error al obtener examen:', error);
    res.status(500).json({ message: 'Error al obtener el examen', error: error.message });
  }
};

// GET /api/examenes/clase/:clase_id  — listar exámenes de una clase (maestro)
exports.getExamenesByClase = async (req, res) => {
  try {
    const { clase_id } = req.params;
    const maestro_id = req.user.id;

    const examenes = await Examen.findAll({
      where: { clase_id, maestro_id, activo: true },
      order: [['created_at', 'DESC']]
    });

    res.json({ examenes });
  } catch (error) {
    console.error('Error al obtener exámenes:', error);
    res.status(500).json({ message: 'Error al obtener los exámenes', error: error.message });
  }
};

// GET /api/examenes/alumno/:clase_id  — listar exámenes de una clase (alumno)
exports.getExamenesByClaseAlumno = async (req, res) => {
  try {
    const { clase_id } = req.params;
    const alumno_id = req.user.id;
    const { RespuestaExamen } = require('../models/Respuestas');

    const examenes = await Examen.findAll({
      where: { clase_id, activo: true },
      attributes: ['id', 'titulo', 'descripcion', 'preguntas', 'color', 'deadline', 'one_attempt', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    const ids = examenes.map(e => e.id);
    const respondidos = ids.length > 0
      ? await RespuestaExamen.findAll({ where: { examen_id: ids, alumno_id }, attributes: ['examen_id'] })
      : [];
    const respondidoSet = new Set(respondidos.map(r => r.examen_id));

    const result = examenes.map(e => ({
      ...e.toJSON(),
      ya_respondido: respondidoSet.has(e.id)
    }));

    res.json({ examenes: result });
  } catch (error) {
    console.error('Error al obtener exámenes:', error);
    res.status(500).json({ message: 'Error al obtener los exámenes', error: error.message });
  }
};

// DELETE /api/examenes/:id  — eliminar examen (soft delete)
exports.deleteExamen = async (req, res) => {
  try {
    const { id } = req.params;
    const maestro_id = req.user.id;

    const examen = await Examen.findOne({ where: { id, maestro_id } });
    if (!examen) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }

    await examen.update({ activo: false });
    res.json({ message: 'Examen eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar examen:', error);
    res.status(500).json({ message: 'Error al eliminar el examen', error: error.message });
  }
};

// Made with Bob
