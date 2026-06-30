import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Poll, Question, Answer } from '../../types';
import { pollService } from '../../services/pollService';
import './TakePoll.css';

const TakePoll: React.FC = () => {
  const navigate = useNavigate();
  const { pollId } = useParams<{ pollId: string }>();
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadPoll();
  }, [pollId]);

  // Timer
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const loadPoll = async () => {
    try {
      setIsLoading(true);
      const pollData = await pollService.getPollById(pollId!);
      setPoll(pollData);

      // Inicializar respuestas vacías
      const initialAnswers: Answer[] = pollData.questions.map(q => ({
        questionId: q.id,
        answer: ''
      }));
      setAnswers(initialAnswers);

      // Iniciar timer si hay límite de tiempo
      if (pollData.timeLimit) {
        setTimeRemaining(pollData.timeLimit * 60);
      }
    } catch (error) {
      console.error('Error al cargar encuesta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, answer } 
          : a
      )
    );
  };

  const handleNext = () => {
    if (poll && currentQuestionIndex < poll.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Verificar que todas las preguntas requeridas estén respondidas
    const unansweredRequired = poll?.questions.filter((q, idx) => 
      q.required && !answers[idx]?.answer
    );

    if (unansweredRequired && unansweredRequired.length > 0) {
      alert(`Por favor responde todas las preguntas requeridas. Faltan ${unansweredRequired.length} pregunta(s).`);
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      await pollService.submitResponse({
        pollId: pollId!,
        answers: answers.map(a => ({ questionId: a.questionId, answer: a.answer }))
      });
      navigate(`/student/poll/${pollId}/results`);
    } catch (error: any) {
      console.error('Error al enviar respuestas:', error);
      alert(error.response?.data?.message || 'Error al enviar la encuesta. Intenta de nuevo.');
    }
  };

  const handleAutoSubmit = () => {
    alert('¡Tiempo agotado! La encuesta se enviará automáticamente.');
    handleConfirmSubmit();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (!poll) return 0;
    const answered = answers.filter(a => a.answer !== '').length;
    return Math.round((answered / poll.questions.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="take-poll-page">
        <div className="loading-state">
          <p>Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="take-poll-page">
        <div className="error-state">
          <p>No se pudo cargar la encuesta</p>
          <button onClick={() => navigate(-1)}>Volver</button>
        </div>
      </div>
    );
  }

  const currentQuestion = poll.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

  return (
    <div className="take-poll-page">
      {/* Header */}
      <header className="poll-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver</span>
        </button>
        <div className="poll-header-info">
          <h1>{poll.title}</h1>
          {timeRemaining !== null && (
            <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
              <FontAwesomeIcon icon={faClock} />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        <span className="progress-text">
          {getProgress()}% completado ({answers.filter(a => a.answer !== '').length}/{poll.questions.length})
        </span>
      </div>

      {/* Question */}
      <div className="question-container">
        <div className="question-header">
          <span className="question-number">
            Pregunta {currentQuestionIndex + 1} de {poll.questions.length}
          </span>
          {currentQuestion.required && (
            <span className="required-badge">Requerida</span>
          )}
          {currentQuestion.points && (
            <span className="points-badge">{currentQuestion.points} puntos</span>
          )}
        </div>

        <h2 className="question-text">{currentQuestion.text}</h2>

        {/* Multiple Choice */}
        {currentQuestion.type === 'multiple-choice' && (
          <div className="options-container">
            {currentQuestion.options?.map((option, idx) => (
              <label key={idx} className="option-label">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={idx}
                  checked={currentAnswer?.answer === idx}
                  onChange={() => handleAnswerChange(currentQuestion.id, idx)}
                />
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
        )}

        {/* True/False */}
        {currentQuestion.type === 'true-false' && (
          <div className="options-container">
            {currentQuestion.options?.map((option, idx) => (
              <label key={idx} className="option-label">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={idx}
                  checked={currentAnswer?.answer === idx}
                  onChange={() => handleAnswerChange(currentQuestion.id, idx)}
                />
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
        )}

        {/* Short Answer */}
        {currentQuestion.type === 'short-answer' && (
          <textarea
            className="answer-textarea"
            value={currentAnswer?.answer as string || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            rows={4}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="navigation-container">
        <button
          className="btn-nav"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Anterior
        </button>

        <div className="question-indicators">
          {poll.questions.map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${idx === currentQuestionIndex ? 'active' : ''} ${answers[idx]?.answer !== '' ? 'answered' : ''}`}
              onClick={() => setCurrentQuestionIndex(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex < poll.questions.length - 1 ? (
          <button className="btn-nav" onClick={handleNext}>
            Siguiente →
          </button>
        ) : (
          <button className="btn-submit" onClick={handleSubmit}>
            <FontAwesomeIcon icon={faCheckCircle} />
            Enviar Encuesta
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>¿Enviar encuesta?</h3>
            <p>
              Has respondido {answers.filter(a => a.answer !== '').length} de {poll.questions.length} preguntas.
            </p>
            <p>Una vez enviada, no podrás modificar tus respuestas.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowConfirmation(false)}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleConfirmSubmit}>
                Sí, Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakePoll;
