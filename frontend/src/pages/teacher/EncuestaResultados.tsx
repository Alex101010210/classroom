import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faChartBar, faDownload, faCircle } from '@fortawesome/free-solid-svg-icons';
import { encuestaService, RespuestaAlumno } from '../../services/api';
import api from '../../services/api';
import ResultsChart, { QuestionStat } from '../../components/analytics/ResultsChart';
import { useEncuestaSocket } from '../../hooks/useSocket';
import './Resultados.css';

interface AnalyticsData {
  encuesta: { id: number; titulo: string; preguntas: any[] };
  totalRespuestas: number;
  questionStats: QuestionStat[];
  respuestas: RespuestaAlumno[];
}

const EncuestaResultados: React.FC = () => {
  const navigate = useNavigate();
  const { encuestaId } = useParams<{ encuestaId: string }>();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'graficas' | 'respuestas'>('graficas');
  const [exporting, setExporting] = useState(false);
  const [liveIndicator, setLiveIndicator] = useState(false);

  const loadData = useCallback(() => {
    if (!encuestaId) return;
    api.get(`/analytics/encuesta/${encuestaId}`)
      .then(r => setData(r.data))
      .catch(() => {
        // Fallback to basic responses endpoint
        encuestaService.getResponses(encuestaId)
          .then(d => {
            setData({
              encuesta: d.encuesta,
              totalRespuestas: d.respuestas.length,
              questionStats: [],
              respuestas: d.respuestas,
            });
          })
          .catch(() => setError('No se pudieron cargar las respuestas.'));
      })
      .finally(() => setIsLoading(false));
  }, [encuestaId]);

  useEffect(() => { loadData(); }, [loadData]);

  // Real-time: new response arrives via Socket.io
  useEncuestaSocket(encuestaId, (_payload) => {
    // Append new response and re-fetch stats
    setLiveIndicator(true);
    setTimeout(() => setLiveIndicator(false), 2000);
    loadData();
  });

  const handleExportCsv = async () => {
    if (!encuestaId) return;
    setExporting(true);
    try {
      const response = await api.get(`/analytics/encuesta/${encuestaId}/csv`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `encuesta_${encuestaId}_resultados.csv`;
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

  const { encuesta, respuestas, totalRespuestas, questionStats } = data;

  // Answers are stored as the option text directly
  const getOptionText = (_pregunta: any, answer: string | number): string => String(answer);

  const alumnoActual = selected !== null ? respuestas[selected] : null;

  return (
    <div className="res-page">
      <header className="app-header">
        <button className="app-header-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver</span>
        </button>
        <h1 className="app-header-title">
          <FontAwesomeIcon icon={faChartBar} style={{ marginRight: 8, opacity: 0.85 }} />
          {encuesta.titulo}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          {liveIndicator && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.82rem', color: '#10b981' }}>
              <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.6rem' }} />
              Nueva respuesta
            </span>
          )}
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
          <div className="res-empty">Ningún alumno ha respondido esta encuesta aún.</div>
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
                {/* Lista de alumnos */}
                <aside className="res-sidebar">
                  <h3>Alumnos</h3>
                  {respuestas.map((r, idx) => (
                    <button
                      key={r.id}
                      className={`res-alumno-btn ${selected === idx ? 'active' : ''}`}
                      onClick={() => setSelected(idx)}
                    >
                      <span className="res-alumno-name">{r.alumno.nombre} {r.alumno.apellido}</span>
                      <span className="res-alumno-date">
                        {new Date(r.submitted_at).toLocaleDateString('es-MX')}
                      </span>
                    </button>
                  ))}
                </aside>

                {/* Detalle de respuestas */}
                <main className="res-detail">
                  {alumnoActual === null ? (
                    <div className="res-select-hint">← Selecciona un alumno para ver sus respuestas</div>
                  ) : (
                    <>
                      <div className="res-alumno-header">
                        <h2>{alumnoActual.alumno.nombre} {alumnoActual.alumno.apellido}</h2>
                        <span className="res-alumno-email">{alumnoActual.alumno.email}</span>
                        <span className="res-alumno-sent">
                          Enviado: {new Date(alumnoActual.submitted_at).toLocaleString('es-MX')}
                        </span>
                      </div>
                      <div className="res-questions">
                        {encuesta.preguntas.map((preg: any, qi: number) => {
                          const resp = alumnoActual.respuestas.find(r => r.questionId === preg.id);
                          const textoResp = resp !== undefined ? getOptionText(preg, resp.answer) : '—';
                          return (
                            <div key={preg.id} className="res-q-card">
                              <span className="res-q-num">Pregunta {qi + 1}</span>
                              <p className="res-q-text">{preg.text || preg.title || '(sin texto)'}</p>
                              <div className="res-q-answer">{textoResp}</div>
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

export default EncuestaResultados;

// Made with Bob
