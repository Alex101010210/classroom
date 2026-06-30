const { Poll, PollResponse } = require('../models/Poll');
const Class = require('../models/Class');
const Enrollment = require('../models/Enrollment');
const { sequelize } = require('../config/db');

// ─────────────────────────────────────────────
// MAESTRO — crear encuesta
// POST /api/polls
// ─────────────────────────────────────────────
exports.createPoll = async (req, res) => {
  try {
    const maestro_id = req.user.id;
    const { clase_id, titulo, descripcion, preguntas, tiempo_limite, fecha_inicio, fecha_fin } = req.body;

    if (!clase_id || !titulo || !titulo.trim()) {
      return res.status(400).json({ message: 'clase_id y titulo son requeridos' });
    }

    // Verificar que la clase pertenezca al maestro
    const classData = await Class.findOne({ where: { id: clase_id, maestro_id } });
    if (!classData) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    const poll = await Poll.create({
      clase_id,
      maestro_id,
      titulo: titulo.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      preguntas: preguntas || [],
      tiempo_limite: tiempo_limite || null,
      fecha_inicio: fecha_inicio || null,
      fecha_fin: fecha_fin || null,
      activa: true
    });

    res.status(201).json({ message: 'Encuesta creada exitosamente', poll: _formatPoll(poll) });
  } catch (error) {
    console.error('Error al crear encuesta:', error);
    res.status(500).json({ message: 'Error al crear la encuesta', error: error.message });
  }
};

// ─────────────────────────────────────────────
// MAESTRO — listar sus encuestas (todas)
// GET /api/polls
// ─────────────────────────────────────────────
exports.getTeacherPolls = async (req, res) => {
  try {
    const maestro_id = req.user.id;
    const polls = await Poll.findAll({
      where: { maestro_id, activa: true },
      order: [['created_at', 'DESC']]
    });
    res.json({ polls: polls.map(_formatPoll) });
  } catch (error) {
    console.error('Error al obtener encuestas:', error);
    res.status(500).json({ message: 'Error al obtener encuestas', error: error.message });
  }
};

// ─────────────────────────────────────────────
// MAESTRO — encuestas de una clase específica
// GET /api/polls/class/:claseId
// ─────────────────────────────────────────────
exports.getClassPolls = async (req, res) => {
  try {
    const maestro_id = req.user.id;
    const { claseId } = req.params;

    const classData = await Class.findOne({ where: { id: claseId, maestro_id } });
    if (!classData) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    const polls = await Poll.findAll({
      where: { clase_id: claseId, activa: true },
      order: [['created_at', 'DESC']]
    });

    res.json({ polls: polls.map(_formatPoll) });
  } catch (error) {
    console.error('Error al obtener encuestas de la clase:', error);
    res.status(500).json({ message: 'Error al obtener encuestas', error: error.message });
  }
};

// ─────────────────────────────────────────────
// ALUMNO — encuestas de su clase con estado (pendiente/completada/expirada)
// GET /api/polls/student/class/:claseId
// ─────────────────────────────────────────────
exports.getStudentClassPolls = async (req, res) => {
  try {
    const alumno_id = req.user.id;
    const { claseId } = req.params;

    // Verificar que el alumno está inscrito en la clase
    const enrollment = await Enrollment.findOne({
      where: { clase_id: claseId, alumno_id, activa: true }
    });
    if (!enrollment) {
      return res.status(403).json({ message: 'No estás inscrito en esta clase' });
    }

    // Obtener encuestas activas de la clase
    const polls = await Poll.findAll({
      where: { clase_id: claseId, activa: true },
      order: [['created_at', 'DESC']]
    });

    // Obtener respuestas del alumno para estas encuestas
    const pollIds = polls.map(p => p.id);
    const responses = pollIds.length > 0
      ? await PollResponse.findAll({ where: { poll_id: pollIds, alumno_id } })
      : [];

    const now = new Date();

    const result = polls.map(poll => {
      const formatted = _formatPoll(poll);
      const response = responses.find(r => r.poll_id === poll.id);

      // Determinar estado
      let status = 'pending';
      if (response) {
        status = 'completed';
      } else if (poll.fecha_fin && new Date(poll.fecha_fin) < now) {
        status = 'expired';
      }

      return {
        ...formatted,
        status,
        studentResponse: response ? {
          id: response.id,
          pollId: response.poll_id,
          studentId: response.alumno_id,
          answers: response.respuestas,
          submittedAt: response.submitted_at,
          score: response.calificacion,
          maxScore: response.calificacion_max,
          percentage: response.porcentaje
        } : undefined
      };
    });

    res.json({ polls: result });
  } catch (error) {
    console.error('Error al obtener encuestas del alumno:', error);
    res.status(500).json({ message: 'Error al obtener encuestas', error: error.message });
  }
};

// ─────────────────────────────────────────────
// ALUMNO — obtener una encuesta por ID
// GET /api/polls/:id
// ─────────────────────────────────────────────
exports.getPollById = async (req, res) => {
  try {
    const alumno_id = req.user.id;
    const { id } = req.params;

    const poll = await Poll.findOne({ where: { id, activa: true } });
    if (!poll) {
      return res.status(404).json({ message: 'Encuesta no encontrada' });
    }

    // Verificar que el alumno está inscrito en la clase
    const enrollment = await Enrollment.findOne({
      where: { clase_id: poll.clase_id, alumno_id, activa: true }
    });
    if (!enrollment) {
      return res.status(403).json({ message: 'No tienes acceso a esta encuesta' });
    }

    res.json({ poll: _formatPoll(poll) });
  } catch (error) {
    console.error('Error al obtener encuesta:', error);
    res.status(500).json({ message: 'Error al obtener la encuesta', error: error.message });
  }
};

// ─────────────────────────────────────────────
// ALUMNO — enviar respuestas
// POST /api/polls/:id/responses
// ─────────────────────────────────────────────
exports.submitResponse = async (req, res) => {
  try {
    const alumno_id = req.user.id;
    const { id } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Las respuestas son requeridas' });
    }

    const poll = await Poll.findOne({ where: { id, activa: true } });
    if (!poll) {
      return res.status(404).json({ message: 'Encuesta no encontrada' });
    }

    // Verificar inscripción
    const enrollment = await Enrollment.findOne({
      where: { clase_id: poll.clase_id, alumno_id, activa: true }
    });
    if (!enrollment) {
      return res.status(403).json({ message: 'No tienes acceso a esta encuesta' });
    }

    // Verificar si ya respondió
    const existing = await PollResponse.findOne({ where: { poll_id: id, alumno_id } });
    if (existing) {
      return res.status(409).json({ message: 'Ya respondiste esta encuesta' });
    }

    // Calcular calificación automática (solo para multiple-choice y true-false)
    const preguntas = poll.preguntas;
    let totalPuntos = 0;
    let puntosObtenidos = 0;

    preguntas.forEach(pregunta => {
      const puntos = pregunta.puntos || 0;
      totalPuntos += puntos;

      if (pregunta.tipo === 'multiple-choice' || pregunta.tipo === 'true-false') {
        if (pregunta.respuesta_correcta !== undefined && pregunta.respuesta_correcta !== null) {
          const respuesta = answers.find(a => a.questionId === pregunta.id);
          if (respuesta && Number(respuesta.answer) === Number(pregunta.respuesta_correcta)) {
            puntosObtenidos += puntos;
          }
        }
      }
    });

    const porcentaje = totalPuntos > 0 ? Math.round((puntosObtenidos / totalPuntos) * 100) : null;

    const response = await PollResponse.create({
      poll_id: id,
      alumno_id,
      respuestas: answers,
      calificacion: totalPuntos > 0 ? puntosObtenidos : null,
      calificacion_max: totalPuntos > 0 ? totalPuntos : null,
      porcentaje
    });

    res.status(201).json({
      message: 'Respuestas enviadas exitosamente',
      response: {
        id: response.id,
        pollId: response.poll_id,
        studentId: response.alumno_id,
        answers: response.respuestas,
        submittedAt: response.submitted_at,
        score: response.calificacion,
        maxScore: response.calificacion_max,
        percentage: response.porcentaje
      }
    });
  } catch (error) {
    console.error('Error al enviar respuestas:', error);
    res.status(500).json({ message: 'Error al enviar respuestas', error: error.message });
  }
};

// ─────────────────────────────────────────────
// ALUMNO — ver mi resultado de una encuesta
// GET /api/polls/:id/my-result
// ─────────────────────────────────────────────
exports.getMyResult = async (req, res) => {
  try {
    const alumno_id = req.user.id;
    const { id } = req.params;

    const response = await PollResponse.findOne({ where: { poll_id: id, alumno_id } });
    if (!response) {
      return res.status(404).json({ message: 'Aún no has respondido esta encuesta' });
    }

    res.json({
      response: {
        id: response.id,
        pollId: response.poll_id,
        studentId: response.alumno_id,
        answers: response.respuestas,
        submittedAt: response.submitted_at,
        score: response.calificacion,
        maxScore: response.calificacion_max,
        percentage: response.porcentaje
      }
    });
  } catch (error) {
    console.error('Error al obtener resultado:', error);
    res.status(500).json({ message: 'Error al obtener el resultado', error: error.message });
  }
};

// ─────────────────────────────────────────────
// Helper interno — dar formato uniforme a un poll
// ─────────────────────────────────────────────
function _formatPoll(poll) {
  return {
    id: String(poll.id),
    classId: String(poll.clase_id),
    teacherId: String(poll.maestro_id),
    title: poll.titulo,
    description: poll.descripcion,
    questions: (poll.preguntas || []).map(q => ({
      id: q.id,
      text: q.texto,
      type: q.tipo,
      options: q.opciones || [],
      correctAnswer: q.respuesta_correcta,
      points: q.puntos || 0
    })),
    isActive: poll.activa,
    timeLimit: poll.tiempo_limite,
    startDate: poll.fecha_inicio,
    endDate: poll.fecha_fin,
    createdAt: poll.created_at
  };
}

// Made with Bob
