import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faFileAlt, faMedal } from '@fortawesome/free-solid-svg-icons';
import { examenService, ResultadosExamen } from '../../services/api';
import './Resultados.css';

const ExamenResultados: React.FC = () => {
  const navigate = useNavigate();
  const { examenId } = useParams<{ examenId: string }>();
  const [data, setData] = useState<ResultadosExamen | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!examenId) return;
    examenService.getResponses(examenId)
      .then(d => setData(d))
      .catch(() => setError('No se pudieron cargar las respuestas.'))
      .finally(() => setIsLoading(false));
  }, [examenId]);

  if (isLoading) return <div className="res-page"><div className="res-state">Cargando...</div></div>;
  if (error || !data) return <div className="res-page"><div className="res-state res-state--error">{error || 'Sin datos'}</div></div>;

  const { examen, respuestas } = data;

  const getOptionText = (pregunta: any, answer: string | number): string => {
    const opts: any[] = pregunta.options || [];
    if (opts.length === 0) return String(answer);
    const idx = typeof answer === 'number' ? answer : parseInt(String(answer), 10);
    if (!isNaN(idx) && opts[idx] !== undefined) {
      return typeof opts[idx] === 'string' ? opts[idx] : opts[idx].text;
    }
    const found = opts.find(o => o.id === String(answer));
    return found ? (found.text || String(answer)) : String(answer);
  };

  const isCorrect = (pregunta: any, answer: string | number): boolean | null => {
    if (!pregunta.correctAnswers || pregunta.correctAnswers.length === 0) return null;
    const correctSet = new Set((pregunta.correctAnswers as any[]).map(String));
    const given = new Set(Array.isArray(answer) ? (answer as any[]).map(String) : [String(answer)]);
    return correctSet.size === given.size && [...correctSet].every(v => given.has(v));
  };

  const getScoreColor = (pct?: number | null) => {
    if (pct == null) return '#57606a';
    if (pct >= 80) return '#10B981';
    if (pct >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const alumnoActual = selected !== null ? respuestas[selected] : null;

  return (
    <div className="res-page">
      <header className="res-header">
        <button className="res-btn-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </button>
        <div className="res-header-info">
          <FontAwesomeIcon icon={faFileAlt} className="res-header-icon" />
          <div>
            <h1>{examen.titulo}</h1>
            <span className="res-subtitle">
              <FontAwesomeIcon icon={faUsers} /> {respuestas.length} respuesta{respuestas.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </header>

      <div className="res-body">
        {respuestas.length === 0 ? (
          <div className="res-empty">Ningún alumno ha presentado este examen aún.</div>
        ) : (
          <div className="res-layout">
            {/* Lista de alumnos con calificación */}
            <aside className="res-sidebar">
              <h3>Alumnos</h3>
              {respuestas.map((r, idx) => (
                <button
                  key={r.id}
                  className={`res-alumno-btn ${selected === idx ? 'active' : ''}`}
                  onClick={() => setSelected(idx)}
                >
                  <span className="res-alumno-name">{r.alumno.nombre} {r.alumno.apellido}</span>
                  {r.porcentaje != null ? (
                    <span className="res-score-badge" style={{ color: getScoreColor(r.porcentaje) }}>
                      <FontAwesomeIcon icon={faMedal} /> {r.porcentaje}%
                    </span>
                  ) : (
                    <span className="res-alumno-date">
                      {new Date(r.submitted_at).toLocaleDateString('es-MX')}
                    </span>
                  )}
                </button>
              ))}
            </aside>

            {/* Detalle */}
            <main className="res-detail">
              {alumnoActual === null ? (
                <div className="res-select-hint">← Selecciona un alumno para ver sus respuestas</div>
              ) : (
                <>
                  <div className="res-alumno-header">
                    <h2>{alumnoActual.alumno.nombre} {alumnoActual.alumno.apellido}</h2>
                    <span className="res-alumno-email">{alumnoActual.alumno.email}</span>
                    {alumnoActual.porcentaje != null && (
                      <div className="res-score-summary" style={{ borderColor: getScoreColor(alumnoActual.porcentaje) }}>
                        <span className="res-score-pct" style={{ color: getScoreColor(alumnoActual.porcentaje) }}>
                          {alumnoActual.porcentaje}%
                        </span>
                        <span className="res-score-pts">
                          {alumnoActual.calificacion} / {alumnoActual.calificacion_max} pts
                        </span>
                      </div>
                    )}
                    <span className="res-alumno-sent">
                      Enviado: {new Date(alumnoActual.submitted_at).toLocaleString('es-MX')}
                    </span>
                  </div>
                  <div className="res-questions">
                    {examen.preguntas.map((preg: any, qi: number) => {
                      const resp = alumnoActual.respuestas.find(r => r.questionId === preg.id);
                      const textoResp = resp !== undefined ? getOptionText(preg, resp.answer) : '—';
                      const correct  = resp !== undefined ? isCorrect(preg, resp.answer) : null;
                      return (
                        <div
                          key={preg.id}
                          className={`res-q-card ${correct === true ? 'correct' : correct === false ? 'incorrect' : ''}`}
                        >
                          <div className="res-q-card-top">
                            <span className="res-q-num">Pregunta {qi + 1}</span>
                            {preg.points > 0 && (
                              <span className="res-q-pts">{preg.points} pts</span>
                            )}
                            {correct === true && <span className="res-q-badge correct">✓ Correcta</span>}
                            {correct === false && <span className="res-q-badge incorrect">✗ Incorrecta</span>}
                          </div>
                          <p className="res-q-text">{preg.title || preg.text || '(sin texto)'}</p>
                          <div className="res-q-answer">{textoResp}</div>
                          {correct === false && preg.correctAnswers?.length > 0 && (
                            <div className="res-q-correct-answer">
                              Respuesta correcta: {getOptionText(preg, preg.correctAnswers[0])}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamenResultados;
