import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle, faClock, faTimesCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { pollService } from '../../services/pollService';
import { PollWithStatus } from '../../types';
import './PollsList.css';

const PollsList: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [polls, setPolls] = useState<PollWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (classId) loadPolls();
  }, [classId]);

  const loadPolls = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await pollService.getPollsByClass(classId!);
      setPolls(data);
    } catch (err: any) {
      console.error('Error al cargar encuestas:', err);
      setError('No se pudieron cargar las encuestas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePollClick = (poll: PollWithStatus) => {
    if (poll.status === 'pending') {
      navigate(`/student/poll/${poll.id}`);
    } else if (poll.status === 'completed') {
      navigate(`/student/poll/${poll.id}/results`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':    return <FontAwesomeIcon icon={faClock}        className="status-icon pending"   />;
      case 'completed':  return <FontAwesomeIcon icon={faCheckCircle}  className="status-icon completed" />;
      case 'expired':    return <FontAwesomeIcon icon={faTimesCircle}  className="status-icon expired"   />;
      default:           return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':   return 'Pendiente';
      case 'completed': return 'Completada';
      case 'expired':   return 'Expirada';
      default:          return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':   return '#fbbf24';
      case 'completed': return '#10b981';
      case 'expired':   return '#ef4444';
      default:          return '#6b7280';
    }
  };

  return (
    <div className="polls-list-page">
      <header className="dashboard-header student">
        <div className="header-logo">
          <h1>PollClass</h1>
        </div>
        <div className="header-info">
          <h2 className="page-title">
            <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '8px' }} />
            Encuestas de la clase
          </h2>
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
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
            <button onClick={loadPolls} style={{ marginTop: '12px', cursor: 'pointer' }}>
              Reintentar
            </button>
          </div>
        ) : polls.length === 0 ? (
          <div className="empty-state">
            <FontAwesomeIcon icon={faClipboardList} style={{ fontSize: '2rem', marginBottom: '12px', color: '#ccc' }} />
            <p>No hay encuestas disponibles en esta clase.</p>
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
                        <FontAwesomeIcon icon={faClock} /> {poll.timeLimit} minutos
                      </span>
                    )}
                    {poll.questions.length > 0 && (
                      <span className="poll-questions">
                        {poll.questions.length} pregunta{poll.questions.length !== 1 ? 's' : ''}
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
                  {poll.status === 'pending'   && 'Responder'}
                  {poll.status === 'completed' && 'Ver Resultados'}
                  {poll.status === 'expired'   && 'Expirada'}
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

// Made with Bob
