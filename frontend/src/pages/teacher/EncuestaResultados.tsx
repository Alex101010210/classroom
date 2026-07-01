import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { encuestaService, ResultadosEncuesta } from '../../services/api';
import './Resultados.css';

const EncuestaResultados: React.FC = () => {
  const navigate = useNavigate();
  const { encuestaId } = useParams<{ encuestaId: string }>();
  const [data, setData] = useState<ResultadosEncuesta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<number | null>(null); // índice del alumno seleccionado

  useEffect(() => {
    if (!encuestaId) return;
    encuestaService.getResponses(encuestaId)
      .then(d => setData(d))
      .catch(() => setError('No se pudieron cargar las respuestas.'))
      .finally(() => setIsLoading(false));
  }, [encuestaId]);

  if (isLoading) return <div className="res-page"><div className="res-state">Cargando...</div></div>;
  if (error || !data) return <div className="res-page"><div className="res-state res-state--error">{error || 'Sin datos'}</div></div>;

  const { encuesta, respuestas } = data;

  // Texto de una opción dado su id o índice
  const getOptionText = (pregunta: any, answer: string | number): string => {
    if (pregunta.type === 'short') return String(answer);
    const opts: any[] = pregunta.options || [];
    if (opts.length === 0) return String(answer);
    const idx = typeof answer === 'number' ? answer : parseInt(String(answer), 10);
    if (!isNaN(idx) && opts[idx] !== undefined) {
      return typeof opts[idx] === 'string' ? opts[idx] : opts[idx].text;
    }
    // fallback: buscar por id
    const found = opts.find(o => o.id === String(answer));
    return found ? (found.text || String(answer)) : String(answer);
  };

  const alumnoActual = selected !== null ? respuestas[selected] : null;

  return (
    <div className="res-page">
      <header className="res-header">
        <button className="res-btn-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </button>
        <div className="res-header-info">
          <FontAwesomeIcon icon={faChartBar} className="res-header-icon" />
          <div>
            <h1>{encuesta.titulo}</h1>
            <span className="res-subtitle">
              <FontAwesomeIcon icon={faUsers} /> {respuestas.length} respuesta{respuestas.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </header>

      <div className="res-body">
        {respuestas.length === 0 ? (
          <div className="res-empty">Ningún alumno ha respondido esta encuesta aún.</div>
        ) : (
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
      </div>
    </div>
  );
};

export default EncuestaResultados;
