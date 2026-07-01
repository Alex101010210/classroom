const Encuesta = require('../models/Encuesta');
const Examen   = require('../models/Examen');
const { RespuestaEncuesta, RespuestaExamen } = require('../models/Respuestas');
const User     = require('../models/User');
const Enrollment = require('../models/Enrollment');

// ── ENCUESTAS ─────────────────────────────────────────────────────────────────

// GET /api/encuestas/:id/check  — alumno verifica si ya respondió
exports.checkEncuesta = async (req, res) => {
  try {
    const alumno_id = req.user.id;
    const { id } = req.params;
    const { RespuestaEncuesta } = require('../models/Respuestas');
    const existente = await RespuestaEncuesta.findOne({ where: { poll_id: id, alumno_id } });
    res.json({ ya_respondida: !!existente });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar respuesta', error: error.message });
  }
};

// POST /api/encuestas/:id/responses  — alumno envía respuestas
exports.submitEncuesta = async (req, res) => {
  try {
    const alumno_id = req.user.id;
    const { id } = req.params;
    const { respuestas } = req.body;

    if (!Array.isArray(respuestas)) {
      return res.status(400).json({ message: 'respuestas debe ser un arreglo' });
    }

    const encuesta = await Encuesta.findOne({ where: { id, activa: true } });
    if (!encuesta) return res.status(404).json({ message: 'Encuesta no encontrada' });

    const inscrito = await Enrollment.findOne({ where: { clase_id: encuesta.clase_id, alumno_id, activa: true } });
    if (!inscrito) return res.status(403).json({ message: 'No estás inscrito en esta clase' });

    const existente = await RespuestaEncuesta.findOne({ where: { poll_id: id, alumno_id } });
    if (existente) return res.status(409).json({ message: 'Ya respondiste esta encuesta' });

    const r = await RespuestaEncuesta.create({ poll_id: id, alumno_id, respuestas });
    res.status(201).json({ message: 'Encuesta enviada exitosamente', id: r.id });
  } catch (error) {
    console.error('Error al enviar encuesta:', error);
    res.status(500).json({ message: 'Error al enviar la encuesta', error: error.message });
  }
};

// GET /api/encuestas/:id/responses  — maestro ve todas las respuestas
exports.getEncuestaResponses = async (req, res) => {
  try {
    const maestro_id = req.user.id;
    const { id } = req.params;

    const encuesta = await Encuesta.findOne({ where: { id, maestro_id } });
    if (!encuesta) return res.status(404).json({ message: 'Encuesta no encontrada' });

    const respuestas = await RespuestaEncuesta.findAll({
      where: { poll_id: id },
      order: [['submitted_at', 'ASC']]
    });

    // Obtener nombres de alumnos
    const alumnoIds = [...new Set(respuestas.map(r => r.alumno_id))];
    const alumnos = await User.findAll({ where: { id: alumnoIds }, attributes: ['id', 'nombre', 'apellido', 'email'] });
    const alumnoMap = Object.fromEntries(alumnos.map(a => [a.id, a]));

    const data = respuestas.map(r => ({
      id: r.id,
      alumno: alumnoMap[r.alumno_id]
        ? { id: r.alumno_id, nombre: alumnoMap[r.alumno_id].nombre, apellido: alumnoMap[r.alumno_id].apellido, email: alumnoMap[r.alumno_id].email }
        : { id: r.alumno_id, nombre: 'Desconocido', apellido: '', email: '' },
      respuestas: r.respuestas,
      submitted_at: r.submitted_at
    }));

    res.json({ encuesta: { id: encuesta.id, titulo: encuesta.titulo, preguntas: encuesta.preguntas }, respuestas: data });
  } catch (error) {
    console.error('Error al obtener respuestas:', error);
    res.status(500).json({ message: 'Error al obtener respuestas', error: error.message });
  }
};

// ── EXÁMENES ──────────────────────────────────────────────────────────────────

// GET /api/examenes/:id/check  — alumno verifica si ya respondió
exports.checkExamen = async (req, res) => {
  try {
    const alumno_id = req.user.id;
    const { id } = req.params;
    const existente = await RespuestaExamen.findOne({ where: { examen_id: id, alumno_id } });
    res.json({ ya_respondido: !!existente });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar respuesta', error: error.message });
  }
};

// POST /api/examenes/:id/responses  — alumno envía respuestas
exports.submitExamen = async (req, res) => {
  try {
    const alumno_id = req.user.id;
    const { id } = req.params;
    const { respuestas } = req.body;

    if (!Array.isArray(respuestas)) {
      return res.status(400).json({ message: 'respuestas debe ser un arreglo' });
    }

    const examen = await Examen.findOne({ where: { id, activo: true } });
    if (!examen) return res.status(404).json({ message: 'Examen no encontrado' });

    if (examen.deadline && new Date(examen.deadline) < new Date()) {
      return res.status(400).json({ message: 'El examen ha expirado' });
    }

    const inscrito = await Enrollment.findOne({ where: { clase_id: examen.clase_id, alumno_id, activa: true } });
    if (!inscrito) return res.status(403).json({ message: 'No estás inscrito en esta clase' });

    if (examen.one_attempt) {
      const existente = await RespuestaExamen.findOne({ where: { examen_id: id, alumno_id } });
      if (existente) return res.status(409).json({ message: 'Ya presentaste este examen' });
    }

    // Calificar automáticamente
    const preguntas = examen.preguntas;
    let totalPts = 0;
    let obtenidos = 0;

    preguntas.forEach(pregunta => {
      const pts = pregunta.points || 0;
      totalPts += pts;
      if (pregunta.correctAnswers && pregunta.correctAnswers.length > 0) {
        // Pregunta con respuesta correcta definida: verificar si el alumno acertó
        const resp = respuestas.find(r => r.questionId === pregunta.id);
        if (resp) {
          const correctSet = new Set(pregunta.correctAnswers.map(String));
          const givenSet   = new Set(Array.isArray(resp.answer) ? resp.answer.map(String) : [String(resp.answer)]);
          const isCorrect  = correctSet.size === givenSet.size && [...correctSet].every(v => givenSet.has(v));
          if (isCorrect) obtenidos += pts;
        }
      } else {
        // Pregunta sin respuesta correcta definida (abierta/opinión): se otorgan los puntos automáticamente
        obtenidos += pts;
      }
    });

    const porcentaje = totalPts > 0 ? Math.round((obtenidos / totalPts) * 100) : null;

    const r = await RespuestaExamen.create({
      examen_id: id,
      alumno_id,
      respuestas,
      calificacion:     totalPts > 0 ? obtenidos  : null,
      calificacion_max: totalPts > 0 ? totalPts   : null,
      porcentaje
    });

    res.status(201).json({ message: 'Examen enviado exitosamente', id: r.id, calificacion: r.calificacion, calificacion_max: r.calificacion_max, porcentaje: r.porcentaje });
  } catch (error) {
    console.error('Error al enviar examen:', error);
    res.status(500).json({ message: 'Error al enviar el examen', error: error.message });
  }
};

// GET /api/examenes/:id/responses  — maestro ve todas las respuestas
exports.getExamenResponses = async (req, res) => {
  try {
    const maestro_id = req.user.id;
    const { id } = req.params;

    const examen = await Examen.findOne({ where: { id, maestro_id } });
    if (!examen) return res.status(404).json({ message: 'Examen no encontrado' });

    const respuestas = await RespuestaExamen.findAll({
      where: { examen_id: id },
      order: [['submitted_at', 'ASC']]
    });

    const alumnoIds = [...new Set(respuestas.map(r => r.alumno_id))];
    const alumnos = await User.findAll({ where: { id: alumnoIds }, attributes: ['id', 'nombre', 'apellido', 'email'] });
    const alumnoMap = Object.fromEntries(alumnos.map(a => [a.id, a]));

    const data = respuestas.map(r => ({
      id: r.id,
      alumno: alumnoMap[r.alumno_id]
        ? { id: r.alumno_id, nombre: alumnoMap[r.alumno_id].nombre, apellido: alumnoMap[r.alumno_id].apellido, email: alumnoMap[r.alumno_id].email }
        : { id: r.alumno_id, nombre: 'Desconocido', apellido: '', email: '' },
      respuestas:       r.respuestas,
      calificacion:     r.calificacion,
      calificacion_max: r.calificacion_max,
      porcentaje:       r.porcentaje,
      submitted_at:     r.submitted_at
    }));

    res.json({ examen: { id: examen.id, titulo: examen.titulo, preguntas: examen.preguntas }, respuestas: data });
  } catch (error) {
    console.error('Error al obtener respuestas:', error);
    res.status(500).json({ message: 'Error al obtener respuestas', error: error.message });
  }
};

// Made with Bob

// GET /api/mis-resultados  — historial completo del alumno (encuestas + exámenes)
exports.getMisResultados = async (req, res) => {
  try {
    const alumno_id = req.user.id;

    // Respuestas de encuestas
    const respEnc = await RespuestaEncuesta.findAll({
      where: { alumno_id },
      order: [['submitted_at', 'DESC']]
    });

    // Respuestas de exámenes
    const respEx = await RespuestaExamen.findAll({
      where: { alumno_id },
      order: [['submitted_at', 'DESC']]
    });

    // Obtener títulos de encuestas
    const encIds = [...new Set(respEnc.map(r => r.poll_id))];
    const encuestas = encIds.length > 0
      ? await Encuesta.findAll({ where: { id: encIds }, attributes: ['id', 'titulo'] })
      : [];
    const encMap = Object.fromEntries(encuestas.map(e => [e.id, e.titulo]));

    // Obtener títulos de exámenes
    const exIds = [...new Set(respEx.map(r => r.examen_id))];
    const examenes = exIds.length > 0
      ? await Examen.findAll({ where: { id: exIds }, attributes: ['id', 'titulo'] })
      : [];
    const exMap = Object.fromEntries(examenes.map(e => [e.id, e.titulo]));

    const encResults = respEnc.map(r => ({
      id:               r.id,
      tipo:             'encuesta',
      actividad_id:     r.poll_id,
      titulo:           encMap[r.poll_id] || `Encuesta #${r.poll_id}`,
      calificacion:     r.calificacion,
      calificacion_max: r.calificacion_max,
      porcentaje:       r.porcentaje,
      submitted_at:     r.submitted_at
    }));

    const exResults = respEx.map(r => ({
      id:               r.id,
      tipo:             'examen',
      actividad_id:     r.examen_id,
      titulo:           exMap[r.examen_id] || `Examen #${r.examen_id}`,
      calificacion:     r.calificacion,
      calificacion_max: r.calificacion_max,
      porcentaje:       r.porcentaje,
      submitted_at:     r.submitted_at
    }));

    // Combinar y ordenar por fecha descendente
    const todos = [...encResults, ...exResults].sort(
      (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );

    res.json({ resultados: todos });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ message: 'Error al obtener historial', error: error.message });
  }
};

