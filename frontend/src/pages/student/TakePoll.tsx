import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { encuestaService, examenService } from '../../services/api';
import './TakePoll.css';

interface Opcion {
  id: string;
  text: string;
}

interface Pregunta {
  id: string;
  // encuesta usa "text", examen usa "title"
  text?: string;
  title?: string;
  type: string; // multiple | checkbox | short | paragraph | dropdown | multiple-choice | true-false | short-answer
  options?: Opcion[] | string[];
  required?: boolean;
  points?: number;
}

interface Actividad {
  id: number;
  titulo: string;
  descripcion: string | null;
  preguntas: Pregunta[];
  deadline?: string | null;
}

const TakePoll: React.FC = () => {
  const navigate = useNavigate();
  const { pollId } = useParams<{ pollId: string }>();
  const location = useLocation();
  const tipo: 'encuesta' | 'examen' = (location.state as any)?.type || 'encuesta';

  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  // answers: map preguntaId → respuesta (string o índice)
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAutoSubmit = useCallback(() => {
    alert('¡Tiempo agotado! La encuesta se enviará automáticamente.');
    navigate(-1);
  }, [navigate]);

  // Timer
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) { handleAutoSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, handleAutoSubmit]);

  useEffect(() => {
    if (!pollId) return;
    const load = async () => {
      try {
        setIsLoading(true);
        if (tipo === 'encuesta') {
          const enc = await encuestaService.getById(pollId);
          setActividad(enc);
        } else {
          const ex = await examenService.getById(pollId);
          setActividad(ex);
          if (ex.deadline && new Date(ex.deadline) < new Date()) {
            setLoadError('Este examen ha expirado.');
          }
        }
      } catch (err) {
        console.error(err);
        setLoadError('Error al cargar la actividad. Verifica que el backend esté corriendo.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [pollId, tipo]);

  const getTexto = (p: Pregunta) => p.text || p.title || '';

  const getOpciones = (p: Pregunta): string[] => {
    if (!p.options || p.options.length === 0) return [];
    if (typeof p.options[0] === 'string') return p.options as string[];
    return (p.options as Opcion[]).map(o => o.text);
  };

  const isMultiple = (type: string) =>
    ['multiple', 'multiple-choice', 'checkbox', 'true-false', 'dropdown'].includes(type);

  const isShort = (type: string) =>
    ['short', 'short-answer', 'paragraph', 'essay'].includes(type);

  const handleAnswer = (preguntaId: string, value: string | number) => {
    setAnswers(prev => ({ ...prev, [preguntaId]: value }));
  };

  const answeredCount = actividad
    ? actividad.preguntas.filter(p => answers[p.id] !== undefined && answers[p.id] !== '').length
    : 0;

  const getProgress = () => {
    if (!actividad || actividad.preguntas.length === 0) return 0;
    return Math.round((answeredCount / actividad.preguntas.length) * 100);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    const unanswered = actividad?.preguntas.filter(
      p => p.required && (answers[p.id] === undefined || answers[p.id] === '')
    );
    if (unanswered && unanswered.length > 0) {
      alert(`Faltan ${unanswered.length} pregunta(s) requerida(s).`);
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    // Por ahora solo registra y vuelve — la persistencia de respuestas se puede agregar después
    console.log('Respuestas enviadas:', answers);
    alert('¡Actividad enviada exitosamente!');
    navigate(-1);
  };

  // ── Render estados ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="take-poll-page">
        <div className="loading-state"><p>Cargando...</p></div>
      </div>
    );
  }

  if (loadError || !actividad) {
    return (
      <div className="take-poll-page">
        <div className="error-state">
          <p>{loadError || 'No se pudo cargar la actividad'}</p>
          <button onClick={() => navigate(-1)}>Volver</button>
        </div>
      </div>
    );
  }

  const currentPregunta = actividad.preguntas[currentIdx];
  const currentAnswer = currentPregunta ? answers[currentPregunta.id] : undefined;
  const opciones = currentPregunta ? getOpciones(currentPregunta) : [];

  return (
    <div className="take-poll-page">
      {/* Header */}
      <header className="poll-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver</span>
        </button>
        <div className="poll-header-info">
          <h1>{actividad.titulo}</h1>
          {timeRemaining !== null && (
            <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
              <FontAwesomeIcon icon={faClock} />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>
      </header>

      {/* Progress */}
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getProgress()}%` }} />
        </div>
        <span className="progress-text">
          {getProgress()}% completado ({answeredCount}/{actividad.preguntas.length})
        </span>
      </div>

      {/* Descripción */}
      {actividad.descripcion && currentIdx === 0 && (
        <div style={{ padding: '0 2rem', color: '#57606a', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
          {actividad.descripcion}
        </div>
      )}

      {/* Pregunta */}
      {currentPregunta && (
        <div className="question-container">
          <div className="question-header">
            <span className="question-number">
              Pregunta {currentIdx + 1} de {actividad.preguntas.length}
            </span>
            {currentPregunta.required && (
              <span className="required-badge">Requerida</span>
            )}
            {currentPregunta.points !== undefined && currentPregunta.points > 0 && (
              <span className="points-badge">{currentPregunta.points} pts</span>
            )}
          </div>

          <h2 className="question-text">{getTexto(currentPregunta)}</h2>

          {/* Opciones múltiples */}
          {isMultiple(currentPregunta.type) && opciones.length > 0 && (
            <div className="options-container">
              {opciones.map((opt, idx) => (
                <label key={idx} className="option-label">
                  <input
                    type={currentPregunta.type === 'checkbox' ? 'checkbox' : 'radio'}
                    name={currentPregunta.id}
                    value={idx}
                    checked={currentAnswer === idx}
                    onChange={() => handleAnswer(currentPregunta.id, idx)}
                  />
                  <span className="option-text">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {/* Respuesta corta / párrafo */}
          {isShort(currentPregunta.type) && (
            <textarea
              className="answer-textarea"
              value={(currentAnswer as string) || ''}
              onChange={e => handleAnswer(currentPregunta.id, e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              rows={currentPregunta.type === 'paragraph' || currentPregunta.type === 'essay' ? 6 : 3}
            />
          )}
        </div>
      )}

      {/* Navegación */}
      <div className="navigation-container">
        <button className="btn-nav" onClick={() => setCurrentIdx(p => p - 1)} disabled={currentIdx === 0}>
          ← Anterior
        </button>

        <div className="question-indicators">
          {actividad.preguntas.map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${idx === currentIdx ? 'active' : ''} ${answers[actividad.preguntas[idx].id] !== undefined && answers[actividad.preguntas[idx].id] !== '' ? 'answered' : ''}`}
              onClick={() => setCurrentIdx(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentIdx < actividad.preguntas.length - 1 ? (
          <button className="btn-nav" onClick={() => setCurrentIdx(p => p + 1)}>
            Siguiente →
          </button>
        ) : (
          <button className="btn-submit" onClick={handleSubmit}>
            <FontAwesomeIcon icon={faCheckCircle} />
            Enviar
          </button>
        )}
      </div>

      {/* Modal confirmación */}
      {showConfirmation && (
        <div className="modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>¿Enviar actividad?</h3>
            <p>Has respondido {answeredCount} de {actividad.preguntas.length} preguntas.</p>
            <p>Una vez enviada, no podrás modificar tus respuestas.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowConfirmation(false)}>Cancelar</button>
              <button className="btn-confirm" onClick={handleConfirmSubmit}>Sí, Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakePoll;
