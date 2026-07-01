const Encuesta = require('../models/Encuesta');
const Class = require('../models/Class');

// POST /api/encuestas  — crear encuesta
exports.createEncuesta = async (req, res) => {
  try {
    const { clase_id, titulo, descripcion, preguntas } = req.body;
    const maestro_id = req.user.id;

    if (!clase_id || !titulo || !titulo.trim()) {
      return res.status(400).json({ message: 'clase_id y titulo son requeridos' });
    }

    // Verificar que la clase pertenece al maestro
    const clase = await Class.findOne({ where: { id: clase_id, maestro_id, activa_class: true } });
    if (!clase) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    const encuesta = await Encuesta.create({
      clase_id,
      maestro_id,
      titulo: titulo.trim(),
      descripcion: descripcion?.trim() || null,
      preguntas: preguntas || [],
      activa: true
    });

    res.status(201).json({ encuesta });
  } catch (error) {
    console.error('Error al crear encuesta:', error);
    res.status(500).json({ message: 'Error al crear la encuesta', error: error.message });
  }
};

// PUT /api/encuestas/:id  — actualizar encuesta
exports.updateEncuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const maestro_id = req.user.id;
    const { titulo, descripcion, preguntas } = req.body;

    const encuesta = await Encuesta.findOne({ where: { id, maestro_id, activa: true } });
    if (!encuesta) {
      return res.status(404).json({ message: 'Encuesta no encontrada' });
    }

    await encuesta.update({
      titulo: titulo?.trim() ?? encuesta.titulo,
      descripcion: descripcion !== undefined ? descripcion?.trim() || null : encuesta.descripcion,
      preguntas: preguntas ?? encuesta.preguntas
    });

    res.json({ encuesta });
  } catch (error) {
    console.error('Error al actualizar encuesta:', error);
    res.status(500).json({ message: 'Error al actualizar la encuesta', error: error.message });
  }
};

// GET /api/encuestas/:id  — obtener una encuesta por ID (alumno o maestro)
exports.getEncuestaById = async (req, res) => {
  try {
    const { id } = req.params;
    const encuesta = await Encuesta.findOne({ where: { id, activa: true } });
    if (!encuesta) {
      return res.status(404).json({ message: 'Encuesta no encontrada' });
    }
    res.json({ encuesta });
  } catch (error) {
    console.error('Error al obtener encuesta:', error);
    res.status(500).json({ message: 'Error al obtener la encuesta', error: error.message });
  }
};

// GET /api/encuestas/clase/:clase_id  — listar encuestas de una clase (maestro)
exports.getEncuestasByClase = async (req, res) => {
  try {
    const { clase_id } = req.params;
    const maestro_id = req.user.id;

    const encuestas = await Encuesta.findAll({
      where: { clase_id, maestro_id, activa: true },
      order: [['created_at', 'DESC']]
    });

    res.json({ encuestas });
  } catch (error) {
    console.error('Error al obtener encuestas:', error);
    res.status(500).json({ message: 'Error al obtener las encuestas', error: error.message });
  }
};

// GET /api/encuestas/alumno/:clase_id  — listar encuestas de una clase (alumno)
exports.getEncuestasByClaseAlumno = async (req, res) => {
  try {
    const { clase_id } = req.params;
    const alumno_id = req.user.id;
    const { RespuestaEncuesta } = require('../models/Respuestas');

    const encuestas = await Encuesta.findAll({
      where: { clase_id, activa: true },
      attributes: ['id', 'titulo', 'descripcion', 'preguntas', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    const ids = encuestas.map(e => e.id);
    const respondidas = ids.length > 0
      ? await RespuestaEncuesta.findAll({ where: { poll_id: ids, alumno_id }, attributes: ['poll_id'] })
      : [];
    const respondidaSet = new Set(respondidas.map(r => r.poll_id));

    const result = encuestas.map(e => ({
      ...e.toJSON(),
      ya_respondida: respondidaSet.has(e.id)
    }));

    res.json({ encuestas: result });
  } catch (error) {
    console.error('Error al obtener encuestas:', error);
    res.status(500).json({ message: 'Error al obtener las encuestas', error: error.message });
  }
};

// DELETE /api/encuestas/:id  — eliminar encuesta (soft delete)
exports.deleteEncuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const maestro_id = req.user.id;

    const encuesta = await Encuesta.findOne({ where: { id, maestro_id } });
    if (!encuesta) {
      return res.status(404).json({ message: 'Encuesta no encontrada' });
    }

    await encuesta.update({ activa: false });
    res.json({ message: 'Encuesta eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar encuesta:', error);
    res.status(500).json({ message: 'Error al eliminar la encuesta', error: error.message });
  }
};

// Made with Bob
