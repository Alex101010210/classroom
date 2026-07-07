/**
 * Converts an array of objects to a CSV string.
 * @param {Object[]} rows
 * @returns {string}
 */
function toCsv(rows) {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val) => {
    const s = val === null || val === undefined ? '' : String(val);
    // Wrap in quotes if contains comma, quote, or newline
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const lines = [
    headers.map(escape).join(','),
    ...rows.map(row => headers.map(h => escape(row[h])).join(','))
  ];
  return lines.join('\n');
}

/**
 * Builds CSV rows for an encuesta's responses.
 * @param {{ id, titulo, preguntas: any[] }} encuesta
 * @param {Array<{ id, alumno, respuestas, submitted_at }>} respuestas
 * @returns {string}
 */
function buildEncuestaCsv(encuesta, respuestas) {
  const rows = respuestas.map(r => {
    const base = {
      encuesta_titulo: encuesta.titulo,
      alumno_nombre: `${r.alumno.nombre} ${r.alumno.apellido}`.trim(),
      alumno_email: r.alumno.email,
      enviado_en: r.submitted_at
    };
    // One column per question
    (encuesta.preguntas || []).forEach((preg, i) => {
      const resp = r.respuestas.find(rs => rs.questionId === preg.id);
      base[`p${i + 1}_${(preg.text || preg.title || 'pregunta').replace(/[,"\n]/g, ' ').substring(0, 40)}`] =
        resp !== undefined ? String(resp.answer) : '';
    });
    return base;
  });
  return toCsv(rows);
}

/**
 * Builds CSV rows for an examen's responses (includes calificacion and porcentaje).
 * @param {{ id, titulo, preguntas: any[] }} examen
 * @param {Array<{ id, alumno, respuestas, calificacion, calificacion_max, porcentaje, submitted_at }>} respuestas
 * @returns {string}
 */
function buildExamenCsv(examen, respuestas) {
  const rows = respuestas.map(r => {
    const base = {
      examen_titulo: examen.titulo,
      alumno_nombre: `${r.alumno.nombre} ${r.alumno.apellido}`.trim(),
      alumno_email: r.alumno.email,
      calificacion: r.calificacion !== null && r.calificacion !== undefined ? r.calificacion : '',
      calificacion_max: r.calificacion_max !== null && r.calificacion_max !== undefined ? r.calificacion_max : '',
      porcentaje: r.porcentaje !== null && r.porcentaje !== undefined ? `${r.porcentaje}%` : '',
      enviado_en: r.submitted_at
    };
    // One column per question
    (examen.preguntas || []).forEach((preg, i) => {
      const resp = r.respuestas.find(rs => rs.questionId === preg.id);
      base[`p${i + 1}_${(preg.title || preg.text || 'pregunta').replace(/[,"\n]/g, ' ').substring(0, 40)}`] =
        resp !== undefined ? String(resp.answer) : '';
    });
    return base;
  });
  return toCsv(rows);
}

module.exports = { toCsv, buildEncuestaCsv, buildExamenCsv };

// Made with Bob
