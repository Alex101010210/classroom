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
      encuesta_id: encuesta.id,
      encuesta_titulo: encuesta.titulo,
      alumno_id: r.alumno.id,
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

module.exports = { toCsv, buildEncuestaCsv };

// Made with Bob
