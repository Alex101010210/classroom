import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle, faTimesCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { pollService } from '../../services/pollService';
import { StudentResponse } from '../../types';
import './PollResults.css';

const PollResults: React.FC = () => {
  const navigate = useNavigate();
  const { pollId } = useParams<{ pollId: string }>();
  const [result, setResult] = useState<StudentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pollId) loadResult();
  }, [pollId]);

  const loadResult = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await pollService.getMyResult(pollId!);
      setResult(data);
    } catch (err) {
      console.error('Error al cargar resultados:', err);
      setError('No se pudieron cargar los resultados.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (pct?: number) => {
    if (pct === undefined) return '#6B7280';
    if (pct >= 80) return '#10B981';
    if (pct >= 60) return '#F59E0B';
    return '#EF4444';
  };

  if (isLoading) {
    return (
      <div className="poll-results-page">
        <div className="pr-state"><p>Cargando resultados...</p></div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="poll-results-page">
        <div className="pr-state pr-state--error">
          <p>{error || 'No se encontraron resultados.'}</p>
          <button onClick={() => navigate('/student/dashboard')}>Ir al inicio</button>
        </div>
      </div>
    );
  }

  const pct = result.percentage ?? 0;

  return (
    <div className="poll-results-page">
      <header className="pr-header">
        <button className="pr-btn-back" onClick={() => navigate('/student/dashboard')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Inicio</span>
        </button>
        <h1>Resultados de la encuesta</h1>
      </header>

      <div className="pr-content">
        {/* Calificación */}
        <div className="pr-score-card">
          <div className="pr-score-circle" style={{ borderColor: getScoreColor(pct) }}>
            <span className="pr-score-pct" style={{ color: getScoreColor(pct) }}>{pct}%</span>
            <span className="pr-score-label">{result.score ?? '—'} / {result.maxScore ?? '—'} pts</span>
          </div>
          <div className="pr-score-meta">
            <p className="pr-score-date">
              Enviado el{' '}
              {new Date(result.submittedAt).toLocaleString('es-MX', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
            {result.timeSpent && (
              <p className="pr-score-time">
                Tiempo empleado: {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
              </p>
            )}
          </div>
        </div>

        {/* Respuestas */}
        <div className="pr-answers">
          <h2>Tus respuestas</h2>
          {result.answers.map((ans, idx) => (
            <div
              key={ans.questionId}
              className={`pr-answer-item ${
                ans.isCorrect === true ? 'correct' :
                ans.isCorrect === false ? 'incorrect' : 'neutral'
              }`}
            >
              <div className="pr-answer-header">
                <span className="pr-answer-num">Pregunta {idx + 1}</span>
                <FontAwesomeIcon
                  icon={
                    ans.isCorrect === true ? faCheckCircle :
                    ans.isCorrect === false ? faTimesCircle : faMinusCircle
                  }
                  className="pr-answer-icon"
                />
              </div>
              <p className="pr-answer-value">Respuesta: <strong>{String(ans.answer)}</strong></p>
              {ans.pointsEarned !== undefined && (
                <p className="pr-answer-pts">{ans.pointsEarned} pts</p>
              )}
            </div>
          ))}
        </div>

        <button className="pr-btn-home" onClick={() => navigate('/student/dashboard')}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default PollResults;
