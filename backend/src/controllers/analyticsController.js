const Encuesta = require('../models/Encuesta');
const { RespuestaEncuesta } = require('../models/Respuestas');
const User = require('../models/User');
const { buildEncuestaCsv } = require('../utils/csvExport');

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

      // Map option index/id to label for multiple-choice
      const opts = preg.options || [];
      const distribution = Object.entries(dist).map(([answer, count]) => {
        let label = answer;
        if (opts.length > 0) {
          const idx = parseInt(answer, 10);
          if (!isNaN(idx) && opts[idx] !== undefined) {
            label = typeof opts[idx] === 'string' ? opts[idx] : (opts[idx].text || answer);
          } else {
            const found = opts.find(o => o.id === answer);
            if (found) label = found.text || answer;
          }
        }
        return {
          answer,
          label,
          count,
          percentage: totalRespuestas > 0 ? Math.round((count / totalRespuestas) * 100) : 0
        };
      });

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

// Made with Bob
