import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileAlt, faMedal } from '@fortawesome/free-solid-svg-icons';
import { examenService } from '../../services/api';
import '../teacher/Resultados.css';

const ExamenResultadoAlumno: React.FC = () => {
  const navigate = useNavigate();
  const { examenId } = useParams<{ examenId: string }>();
  const [data, setData] = useState<Awaited<ReturnType<typeof examenService.getMiRespuesta>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!examenId) return;
    examenService.getMiRespuesta(examenId)
      .then(d => setData(d))
      .catch(() => setError('No se pudo cargar tu resultado. Verifica que hayas presentado este examen.'))
      .finally(() => setIsLoading(false));
  }, [examenId]);

  const getScoreColor = (pct: number | null) => {
    if (pct == null) return '#57606a';
    if (pct >= 80) return '#10B981';
    if (pct >= 60) return '#F59E0B';
    return '#EF4444';
  };

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

  if (isLoading) return (
    <div className="res-page"><div className="res-state">Cargando tu resultado...</div></div>
  );

  if (error || !data) return (
    <div className="res-page">
      <header className="app-header">
        <button className="app-header-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /><span>Volver</span>
        </button>
        <h1 className="app-header-title">Mi Resultado</h1>
      </header>
      <div className="res-state res-state--error" style={{ padding: '2rem' }}>{error || 'Sin datos'}</div>
    </div>
  );

  const { examen, respuesta } = data;
  const pct = respuesta.porcentaje;

  return (
    <div className="res-page">
      <header className="app-header">
        <button className="app-header-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /><span>Volver</span>
        </button>
        <h1 className="app-header-title">
          <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: 8, opacity: 0.85 }} />
          {examen.titulo}
        </h1>
        {pct != null && (
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', marginLeft: 'auto', fontWeight: 600 }}>
            <FontAwesomeIcon icon={faMedal} style={{ marginRight: 5 }} />
            {pct}%
          </span>
        )}
      </header>

      <div className="res-body">
        <div className="res-detail" style={{ maxWidth: 700, margin: '0 auto' }}>
          {/* Resumen de calificación */}
          {pct != null && (
            <div className="res-alumno-header" style={{ marginBottom: '1.5rem' }}>
              <div className="res-score-summary" style={{ borderColor: getScoreColor(pct) }}>
                <span className="res-score-pct" style={{ color: getScoreColor(pct) }}>{pct}%</span>
                <span className="res-score-pts">{respuesta.calificacion} / {respuesta.calificacion_max} pts</span>
              </div>
              <span className="res-alumno-sent">
                Enviado: {new Date(respuesta.submitted_at).toLocaleString('es-MX')}
              </span>
            </div>
          )}

          {/* Preguntas y respuestas */}
          <div className="res-questions">
            {examen.preguntas.map((preg: any, qi: number) => {
              const resp = respuesta.respuestas.find(r => r.questionId === preg.id);
              const textoResp = resp !== undefined ? getOptionText(preg, resp.answer) : '—';
              const correct = resp !== undefined ? isCorrect(preg, resp.answer) : null;
              return (
                <div
                  key={preg.id}
                  className={`res-q-card ${correct === true ? 'correct' : correct === false ? 'incorrect' : ''}`}
                >
                  <div className="res-q-card-top">
                    <span className="res-q-num">Pregunta {qi + 1}</span>
                    {preg.points > 0 && <span className="res-q-pts">{preg.points} pts</span>}
                    {correct === true  && <span className="res-q-badge correct">✓ Correcta</span>}
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
        </div>
      </div>
    </div>
  );
};

export default ExamenResultadoAlumno;
