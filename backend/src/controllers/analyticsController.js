const Encuesta = require('../models/Encuesta');
const Examen   = require('../models/Examen');
const { RespuestaEncuesta, RespuestaExamen } = require('../models/Respuestas');
const User = require('../models/User');
const { buildEncuestaCsv, buildExamenCsv } = require('../utils/csvExport');

/**
 * GET /api/analytics/encuesta/:encuestaId
 * Returns aggregated stats + per-question distributions for a teacher's encuesta.
 */
exports.getEncuestaStats = async (req, res) => {
  try {
    const maestro_id = req.user.id;
    const { encuestaId } = req.params;

    const encuesta = await Encuesta.findOne({ where: { id: encuestaId, maestro_id } });
    if (!encuesta) return res.status(404).json({ message: 'Encuesta no encontrada' });

    const respuestas = await RespuestaEncuesta.findAll({
      where: { poll_id: encuestaId },
      order: [['submitted_at', 'ASC']]
    });

    const alumnoIds = [...new Set(respuestas.map(r => r.alumno_id))];
    const alumnos = await User.findAll({
      where: { id: alumnoIds },
      attributes: ['id', 'nombre', 'apellido', 'email']
    });
    const alumnoMap = Object.fromEntries(alumnos.map(a => [a.id, a]));

    const totalRespuestas = respuestas.length;

    // Per-question distribution
    const questionStats = (encuesta.preguntas || []).map(preg => {
      const dist = {};
      respuestas.forEach(r => {
        const resp = r.respuestas.find(rs => rs.questionId === preg.id);
        if (resp !== undefined) {
          const key = String(resp.answer);
          dist[key] = (dist[key] || 0) + 1;
        }
      });

      // Answers are stored as the option text directly
      const distribution = Object.entries(dist).map(([answer, count]) => ({
        answer,
        label: answer,
        count,
        percentage: totalRespuestas > 0 ? Math.round((count / totalRespuestas) * 100) : 0
      }));

      return {
        questionId: preg.id,
        questionText: preg.text || preg.title || '',
        questionType: preg.type,
        totalAnswers: distribution.reduce((s, d) => s + d.count, 0),
        distribution
      };
    });

    const data = respuestas.map(r => ({
      id: r.id,
      alumno: alumnoMap[r.alumno_id]
        ? {
            id: r.alumno_id,
            nombre: alumnoMap[r.alumno_id].nombre,
            apellido: alumnoMap[r.alumno_id].apellido,
            email: alumnoMap[r.alumno_id].email
          }
        : { id: r.alumno_id, nombre: 'Desconocido', apellido: '', email: '' },
      respuestas: r.respuestas,
      submitted_at: r.submitted_at
    }));

    res.json({
      encuesta: { id: encuesta.id, titulo: encuesta.titulo, preguntas: encuesta.preguntas },
      totalRespuestas,
      questionStats,
      respuestas: data
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

/**
 * GET /api/analytics/encuesta/:encuestaId/csv
 * Downloads a CSV file with all responses for a teacher's encuesta.
 */
exports.exportEncuestaCsv = async (req, res) => {
  try {
    const maestro_id = req.user.id;
    const { encuestaId } = req.params;

    const encuesta = await Encuesta.findOne({ where: { id: encuestaId, maestro_id } });
    if (!encuesta) return res.status(404).json({ message: 'Encuesta no encontrada' });

    const respuestas = await RespuestaEncuesta.findAll({
      where: { poll_id: encuestaId },
      order: [['submitted_at', 'ASC']]
    });

    const alumnoIds = [...new Set(respuestas.map(r => r.alumno_id))];
    const alumnos = await User.findAll({
      where: { id: alumnoIds },
      attributes: ['id', 'nombre', 'apellido', 'email']
    });
    const alumnoMap = Object.fromEntries(alumnos.map(a => [a.id, a]));

    const data = respuestas.map(r => ({
      id: r.id,
      alumno: alumnoMap[r.alumno_id]
        ? {
            id: r.alumno_id,
            nombre: alumnoMap[r.alumno_id].nombre,
            apellido: alumnoMap[r.alumno_id].apellido,
            email: alumnoMap[r.alumno_id].email
          }
        : { id: r.alumno_id, nombre: 'Desconocido', apellido: '', email: '' },
      respuestas: r.respuestas,
      submitted_at: r.submitted_at
    }));

    const csv = buildEncuestaCsv(
      { id: encuesta.id, titulo: encuesta.titulo, preguntas: encuesta.preguntas },
      data
    );

    const filename = `encuesta_${encuestaId}_resultados.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8 compatibility
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    res.status(500).json({ message: 'Error al exportar CSV', error: error.message });
  }
};

/**
 * GET /api/analytics/examen/:examenId
 * Returns aggregated stats + per-question distributions for a teacher's examen.
 */
exports.getExamenStats = async (req, res) => {
  try {
    const maestro_id = req.user.id;
    const { examenId } = req.params;

    const examen = await Examen.findOne({ where: { id: examenId, maestro_id } });
    if (!examen) return res.status(404).json({ message: 'Examen no encontrado' });

    const respuestas = await RespuestaExamen.findAll({
      where: { examen_id: examenId },
      order: [['submitted_at', 'ASC']]
    });

    const alumnoIds = [...new Set(respuestas.map(r => r.alumno_id))];
    const alumnos = await User.findAll({
      where: { id: alumnoIds },
      attributes: ['id', 'nombre', 'apellido', 'email']
    });
    const alumnoMap = Object.fromEntries(alumnos.map(a => [a.id, a]));

    const totalRespuestas = respuestas.length;

    // Per-question distribution (only for questions with defined options)
    const questionStats = (examen.preguntas || []).map(preg => {
      const dist = {};
      respuestas.forEach(r => {
        const resp = r.respuestas.find(rs => rs.questionId === preg.id);
        if (resp !== undefined) {
          const key = String(resp.answer);
          dist[key] = (dist[key] || 0) + 1;
        }
      });

      const distribution = Object.entries(dist).map(([answer, count]) => ({
        answer,
        label: answer,
        count,
        percentage: totalRespuestas > 0 ? Math.round((count / totalRespuestas) * 100) : 0
      }));

      return {
        questionId: preg.id,
        questionText: preg.title || preg.text || '',
        questionType: preg.type,
        totalAnswers: distribution.reduce((s, d) => s + d.count, 0),
        distribution
      };
    });

    const data = respuestas.map(r => ({
      id: r.id,
      alumno: alumnoMap[r.alumno_id]
        ? {
            id: r.alumno_id,
            nombre: alumnoMap[r.alumno_id].nombre,
            apellido: alumnoMap[r.alumno_id].apellido,
            email: alumnoMap[r.alumno_id].email
          }
        : { id: r.alumno_id, nombre: 'Desconocido', apellido: '', email: '' },
      respuestas:       r.respuestas,
      calificacion:     r.calificacion,
      calificacion_max: r.calificacion_max,
      porcentaje:       r.porcentaje,
      submitted_at:     r.submitted_at
    }));

    res.json({
      examen: { id: examen.id, titulo: examen.titulo, preguntas: examen.preguntas },
      totalRespuestas,
      questionStats,
      respuestas: data
    });
  } catch (error) {
    console.error('Error al obtener estadísticas del examen:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

/**
 * GET /api/analytics/examen/:examenId/csv
 * Downloads a CSV file with all responses for a teacher's examen.
 */
exports.exportExamenCsv = async (req, res) => {
  try {
    const maestro_id = req.user.id;
    const { examenId } = req.params;

    const examen = await Examen.findOne({ where: { id: examenId, maestro_id } });
    if (!examen) return res.status(404).json({ message: 'Examen no encontrado' });

    const respuestas = await RespuestaExamen.findAll({
      where: { examen_id: examenId },
      order: [['submitted_at', 'ASC']]
    });

    const alumnoIds = [...new Set(respuestas.map(r => r.alumno_id))];
    const alumnos = await User.findAll({
      where: { id: alumnoIds },
      attributes: ['id', 'nombre', 'apellido', 'email']
    });
    const alumnoMap = Object.fromEntries(alumnos.map(a => [a.id, a]));

    const data = respuestas.map(r => ({
      id: r.id,
      alumno: alumnoMap[r.alumno_id]
        ? {
            id: r.alumno_id,
            nombre: alumnoMap[r.alumno_id].nombre,
            apellido: alumnoMap[r.alumno_id].apellido,
            email: alumnoMap[r.alumno_id].email
          }
        : { id: r.alumno_id, nombre: 'Desconocido', apellido: '', email: '' },
      respuestas:       r.respuestas,
      calificacion:     r.calificacion,
      calificacion_max: r.calificacion_max,
      porcentaje:       r.porcentaje,
      submitted_at:     r.submitted_at
    }));

    const csv = buildExamenCsv(
      { id: examen.id, titulo: examen.titulo, preguntas: examen.preguntas },
      data
    );

    const filename = `examen_${examenId}_resultados.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8 compatibility
  } catch (error) {
    console.error('Error al exportar CSV del examen:', error);
    res.status(500).json({ message: 'Error al exportar CSV', error: error.message });
  }
};

// Made with Bob
