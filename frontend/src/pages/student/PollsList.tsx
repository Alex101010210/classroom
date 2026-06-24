import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle, faClock, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { PollWithStatus } from '../../types';
import './PollsList.css';

const PollsList: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [polls, setPolls] = useState<PollWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [className, setClassName] = useState('');

  useEffect(() => {
    loadPolls();
  }, [classId]);

  const loadPolls = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Reemplazar con llamada real a la API

      
      // SIMULACIÓN TEMPORAL - Datos de prueba
      const mockPolls: PollWithStatus[] = [
        {
          id: '1',
          title: 'Examen de Matemáticas - Unidad 1',
          description: 'Evaluación de álgebra básica',
          classId: classId || '',
          className: 'Matemáticas 101',
          teacherId: 'teacher1',
          questions: [
            { id: '1', text: '¿Cuánto es 2+2?', type: 'multiple-choice', options: ['3', '4', '5'], correctAnswer: 1, points: 10 },
            { id: '2', text: '¿Cuánto es 5*5?', type: 'multiple-choice', options: ['20', '25', '30'], correctAnswer: 1, points: 10 }
          ],
          isActive: true,
          timeLimit: 30,
          createdAt: new Date(),
          status: 'pending'
        },
        {
          id: '2',
          title: 'Quiz de Historia',
          description: 'Revolución Mexicana',
          classId: classId || '',
          className: 'Historia',
          teacherId: 'teacher1',
          questions: [
            { id: '1', text: '¿En qué año inició?', type: 'short-answer', points: 10 }
          ],
          isActive: true,
          createdAt: new Date(Date.now() - 86400000),
          status: 'completed',
          studentResponse: {
            id: 'resp1',
            pollId: '2',
            studentId: 'student1',
            answers: [{ questionId: '1', answer: '1910' }],
            submittedAt: new Date(),
            score: 85,
            maxScore: 100,
            percentage: 85
          }
        },
        {
          id: '3',
          title: 'Examen Final',
          description: 'Evaluación final del semestre',
          classId: classId || '',
          className: 'Matemáticas 101',
          teacherId: 'teacher1',
          questions: [],
          isActive: false,
          endDate: new Date(Date.now() - 86400000),
          createdAt: new Date(Date.now() - 172800000),
          status: 'expired'
        }
      ];
      
      setPolls(mockPolls);
      setClassName(mockPolls[0]?.className || 'Clase');
    } catch (error) {
      console.error('Error al cargar encuestas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePollClick = (poll: PollWithStatus) => {
    if (poll.status === 'pending') {
      // Navegar a responder encuesta
      navigate(`/student/poll/${poll.id}`);
    } else if (poll.status === 'completed') {
      // Navegar a ver resultados
      navigate(`/student/poll/${poll.id}/results`);
    } else {
      // Encuesta expirada - no hacer nada
      alert('Esta encuesta ha expirado');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FontAwesomeIcon icon={faClock} className="status-icon pending" />;
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon completed" />;
      case 'expired':
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon expired" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'completed':
        return 'Completada';
      case 'expired':
        return 'Expirada';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#fbbf24'; // amarillo
      case 'completed':
        return '#10b981'; // verde
      case 'expired':
        return '#ef4444'; // rojo
      default:
        return '#6b7280'; // gris
    }
  };

  return (
    <div className="polls-list-page">
      <header className="dashboard-header student">
        <div className="header-logo">
          <h1>Logo</h1>
        </div>
        <div className="header-info">
          <h2 className="page-title">Encuestas - {className}</h2>
        </div>
        <div className="header-actions">
          <button className="btn-header btn-back" onClick={() => navigate('/student/dashboard')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
      </header>

      <div className="polls-content">
        {isLoading ? (
          <div className="loading-state">
            <p>Cargando encuestas...</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="empty-state">
            <p> No hay encuestas disponibles en esta clase</p>
          </div>
        ) : (
          <div className="polls-grid">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className={`poll-card ${poll.status}`}
                style={{ borderLeftColor: getStatusColor(poll.status) }}
              >
                <div className="poll-card-header">
                  <h3>{poll.title}</h3>
                  <div className="poll-status">
                    {getStatusIcon(poll.status)}
                    <span>{getStatusText(poll.status)}</span>
                  </div>
                </div>

                {poll.description && (
                  <p className="poll-description">{poll.description}</p>
                )}

                <div className="poll-card-footer">
                  <div className="poll-info">
                    {poll.timeLimit && (
                      <span className="poll-time">
                         {poll.timeLimit} minutos
                      </span>
                    )}
                    {poll.questions.length > 0 && (
                      <span className="poll-questions">
                         {poll.questions.length} preguntas
                      </span>
                    )}
                  </div>

                  {poll.status === 'completed' && poll.studentResponse?.percentage !== undefined && (
                    <div className="poll-score">
                      Calificación: {poll.studentResponse.percentage}%
                    </div>
                  )}
                </div>

                <button 
                  className="btn-action"
                  onClick={() => handlePollClick(poll)}
                  disabled={poll.status === 'expired'}
                >
                  {poll.status === 'pending' && ' Responder'}
                  {poll.status === 'completed' && ' Ver Resultados'}
                  {poll.status === 'expired' && ' Expirada'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollsList;
