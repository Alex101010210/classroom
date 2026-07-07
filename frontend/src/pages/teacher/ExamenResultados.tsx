import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faFileAlt, faMedal, faDownload } from '@fortawesome/free-solid-svg-icons';
import { examenService, ResultadosExamen } from '../../services/api';
import api from '../../services/api';
import ResultsChart, { QuestionStat } from '../../components/analytics/ResultsChart';
import './Resultados.css';

interface AnalyticsData {
  examen: { id: number; titulo: string; preguntas: any[] };
  totalRespuestas: number;
  questionStats: QuestionStat[];
  respuestas: ResultadosExamen['respuestas'];
}

const ExamenResultados: React.FC = () => {
  const navigate = useNavigate();
  const { examenId } = useParams<{ examenId: string }>();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'graficas' | 'respuestas'>('graficas');
  const [exporting, setExporting] = useState(false);

  const loadData = useCallback(() => {
    if (!examenId) return;
    api.get(`/analytics/examen/${examenId}`)
      .then(r => setData(r.data))
      .catch(() => {
        // Fallback to basic responses endpoint
        examenService.getResponses(examenId)
          .then(d => {
            setData({
              examen: d.examen,
              totalRespuestas: d.respuestas.length,
              questionStats: [],
              respuestas: d.respuestas,
            });
          })
          .catch(() => setError('No se pudieron cargar las respuestas.'));
      })
      .finally(() => setIsLoading(false));
  }, [examenId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleExportCsv = async () => {
    if (!examenId) return;
    setExporting(true);
    try {
      const response = await api.get(`/analytics/examen/${examenId}/csv`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `examen_${examenId}_resultados.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Error al exportar CSV. Intenta de nuevo.');
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) return <div className="res-page"><div className="res-state">Cargando...</div></div>;
  if (error || !data) return <div className="res-page"><div className="res-state res-state--error">{error || 'Sin datos'}</div></div>;

  const { examen, respuestas, totalRespuestas, questionStats } = data;

  // Answers are stored as the option text directly
  const getOptionText = (_pregunta: any, answer: string | number): string => String(answer);

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
      <header className="app-header">
        <button className="app-header-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver</span>
        </button>
        <h1 className="app-header-title">
          <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: 8, opacity: 0.85 }} />
          {examen.titulo}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem' }}>
            <FontAwesomeIcon icon={faUsers} style={{ marginRight: 5 }} />
            {totalRespuestas} respuesta{totalRespuestas !== 1 ? 's' : ''}
          </span>
          <button
            className="app-header-btn"
            onClick={handleExportCsv}
            disabled={exporting || totalRespuestas === 0}
            title="Exportar a CSV"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <FontAwesomeIcon icon={faDownload} />
            {exporting ? 'Exportando...' : 'CSV'}
          </button>
        </div>
      </header>

      <div className="res-body">
        {respuestas.length === 0 ? (
          <div className="res-empty">Ningún alumno ha presentado este examen aún.</div>
        ) : (
          <>
            {/* Tab navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                onClick={() => setActiveTab('graficas')}
                style={{
                  padding: '0.45rem 1.1rem',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  background: activeTab === 'graficas' ? '#3b82d4' : '#fff',
                  color: activeTab === 'graficas' ? '#fff' : '#1f2328',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.88rem',
                }}
              >
                Gráficas
              </button>
              <button
                onClick={() => setActiveTab('respuestas')}
                style={{
                  padding: '0.45rem 1.1rem',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  background: activeTab === 'respuestas' ? '#3b82d4' : '#fff',
                  color: activeTab === 'respuestas' ? '#fff' : '#1f2328',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.88rem',
                }}
              >
                Por alumno
              </button>
            </div>

            {/* Gráficas tab */}
            {activeTab === 'graficas' && (
              <ResultsChart stats={questionStats} />
            )}

            {/* Por alumno tab */}
            {activeTab === 'respuestas' && (
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
          </>
        )}
      </div>
    </div>
  );
};

export default ExamenResultados;
