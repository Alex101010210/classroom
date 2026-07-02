import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle, faClock, faTimesCircle, faFileAlt, faPollH } from '@fortawesome/free-solid-svg-icons';
import { encuestaService, examenService } from '../../services/api';
import './PollsList.css';

type ItemStatus = 'pending' | 'completed' | 'expired';

interface ActivityItem {
  id: number;
  type: 'encuesta' | 'examen';
  title: string;
  description: string;
  numPreguntas: number;
  deadline?: string | null;
  status: ItemStatus;
  color?: string;
}

const PollsList: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [className, setClassName] = useState('');

  useEffect(() => {
    if (!classId) return;

    // Nombre de la clase desde localStorage (guardado por el dashboard)
    const myClasses: any[] = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const found = myClasses.find((c: any) => String(c.id) === String(classId));
    if (found) setClassName(found.nombre_class || '');

    const fetchAll = async () => {
      try {
        const [encuestas, examenes] = await Promise.all([
          encuestaService.getByClaseAlumno(classId),
          examenService.getByClaseAlumno(classId),
        ]);

        const mapped: ActivityItem[] = [
          ...encuestas.map(e => ({
            id: e.id,
            type: 'encuesta' as const,
            title: e.titulo,
            description: e.descripcion || '',
            numPreguntas: e.preguntas?.length ?? 0,
            status: (e.ya_respondida ? 'completed' : 'pending') as ItemStatus,
          })),
          ...examenes.map(e => ({
            id: e.id,
            type: 'examen' as const,
            title: e.titulo,
            description: e.descripcion || '',
            numPreguntas: e.preguntas?.length ?? 0,
            deadline: e.deadline,
            color: e.color,
            status: (e.ya_respondido
              ? 'completed'
              : e.deadline && new Date(e.deadline) < new Date()
                ? 'expired'
                : 'pending') as ItemStatus,
          })),
        ].sort((a, b) => {
          if (a.status === b.status) return 0;
          return a.status === 'pending' ? -1 : 1;
        });

        setItems(mapped);
      } catch (err) {
        console.error('Error al cargar actividades:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [classId]);

  const handleClick = (item: ActivityItem) => {
    if (item.status === 'expired') {
      alert('Esta actividad ha expirado');
      return;
    }
    if (item.status === 'completed') {
      // Los exámenes completados quedan bloqueados (botón gris), solo encuestas van a resultados
      if (item.type === 'encuesta') {
        navigate(`/student/poll/${item.id}/results`);
      }
      return;
    }
    // pending — pasamos el tipo en state para que TakePoll sepa qué cargar
    navigate(`/student/poll/${item.id}`, { state: { type: item.type } });
  };

  const statusColor = (s: ItemStatus) => {
    if (s === 'pending')   return '#fbbf24';
    if (s === 'completed') return '#10b981';
    return '#ef4444';
  };

  const statusIcon = (s: ItemStatus) => {
    if (s === 'pending')   return <FontAwesomeIcon icon={faClock}       className="status-icon pending"   />;
    if (s === 'completed') return <FontAwesomeIcon icon={faCheckCircle} className="status-icon completed" />;
    return                        <FontAwesomeIcon icon={faTimesCircle} className="status-icon expired"   />;
  };

  const statusText = (s: ItemStatus) => {
    if (s === 'pending')   return 'Pendiente';
    if (s === 'completed') return 'Completada';
    return 'Expirada';
  };

  const typeIcon = (type: 'encuesta' | 'examen') =>
    type === 'examen'
      ? <FontAwesomeIcon icon={faFileAlt} className="type-icon" title="Examen" />
      : <FontAwesomeIcon icon={faPollH}   className="type-icon" title="Encuesta" />;

  const formatDeadline = (dl: string) =>
    new Date(dl).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="polls-list-page">
      <header className="dashboard-header student">
        <div className="header-actions">
          <button className="btn-header btn-back" onClick={() => navigate('/student/dashboard')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
        <div className="header-info">
          <h2 className="page-title">
            Actividades{className ? ` — ${className}` : ''}
          </h2>
        </div>
        <div className="header-logo">
          <h1>PollClass</h1>
        </div>
      </header>

      <div className="polls-content">
        {isLoading ? (
          <div className="loading-state">
            <p>Cargando actividades...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>No hay encuestas ni exámenes disponibles en esta clase.</p>
          </div>
        ) : (
          <div className="polls-grid">
            {items.map((item) => (
              <div
                key={item.id}
                className={`poll-card ${item.status}`}
                style={{ borderLeftColor: statusColor(item.status) }}
              >
                <div className="poll-card-header">
                  <h3>
                    {item.title}
                  </h3>
                  <div className="poll-status">
                    {statusIcon(item.status)}
                    <span>{statusText(item.status)}</span>
                  </div>
                </div>

                <span className={`type-badge type-badge--${item.type}`}>
                  {typeIcon(item.type)}
                  {item.type === 'examen' ? 'Examen' : 'Encuesta'}
                </span>

                {item.description && (
                  <p className="poll-description">{item.description}</p>
                )}

                <div className="poll-card-footer">
                  <div className="poll-info">
                    {item.numPreguntas > 0 && (
                      <span className="poll-questions">
                        {item.numPreguntas} pregunta{item.numPreguntas !== 1 ? 's' : ''}
                      </span>
                    )}
                    {item.deadline && (
                      <span className="poll-time" title="Fecha límite">
                        🕐 {formatDeadline(item.deadline)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className="btn-action"
                  onClick={() => handleClick(item)}
                  disabled={item.status === 'expired' || (item.type === 'examen' && item.status === 'completed')}
                >
                  {item.status === 'pending'   && 'Responder'}
                  {item.status === 'completed' && item.type === 'encuesta' && 'Ver Resultados'}
                  {item.status === 'completed' && item.type === 'examen'   && 'Contestado'}
                  {item.status === 'expired'   && 'Expirada'}
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
