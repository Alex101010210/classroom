import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faUser,
  faEnvelope,
  faCheckCircle,
  faClock,
  faClipboardList,
  faTrophy,
  faBook,
} from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/authService';
import { enrollmentService, StudentClass } from '../../services/api';
import { StudentResponse } from '../../types';
import './StudentProfile.css';

interface UserData {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: number;
}

const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [history, setHistory] = useState<StudentResponse[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [myClasses, setMyClasses] = useState<StudentClass[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    loadHistory();
    loadMyClasses();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      // Se conectará al endpoint cuando el backend lo implemente
      setHistory([]);
    } catch (err) {
      console.error('Error al cargar historial:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadMyClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const classes = await enrollmentService.getMyClasses();
      setMyClasses(classes);
    } catch (err) {
      console.error('Error al cargar clases:', err);
      setMyClasses([]);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const getScoreColor = (pct?: number) => {
    if (pct === undefined) return '#6B7280';
    if (pct >= 80) return '#10B981';
    if (pct >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const completedCount = history.filter(r => r.score !== undefined).length;
  const avgScore = completedCount > 0
    ? Math.round(history.reduce((acc, r) => acc + (r.percentage ?? 0), 0) / completedCount)
    : null;

  return (
    <div className="sp-page">
      <header className="sp-header">
        <button className="sp-btn-back" onClick={() => navigate('/student/dashboard')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Dashboard</span>
        </button>
        <h1>Mi Perfil</h1>
      </header>

      <div className="sp-content">
        {/* Tarjeta de usuario */}
        <div className="sp-card sp-user-card">
          <div className="sp-avatar">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="sp-user-info">
            <h2 className="sp-user-name">
              {user ? `${user.nombre} ${user.apellido}` : '—'}
            </h2>
            <span className="sp-user-badge">Alumno</span>
          </div>
          <div className="sp-user-fields">
            <div className="sp-field">
              <FontAwesomeIcon icon={faEnvelope} className="sp-field-icon" />
              <div>
                <p className="sp-field-label">Correo electrónico</p>
                <p className="sp-field-value">{user?.email ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="sp-stats-row">
          <div className="sp-stat-card">
            <FontAwesomeIcon icon={faBook} className="sp-stat-icon" />
            <span className="sp-stat-num">{myClasses.length}</span>
            <span className="sp-stat-label">Clases inscritas</span>
          </div>
          <div className="sp-stat-card">
            <FontAwesomeIcon icon={faClipboardList} className="sp-stat-icon" />
            <span className="sp-stat-num">{history.length}</span>
            <span className="sp-stat-label">Encuestas respondidas</span>
          </div>
          <div className="sp-stat-card">
            <FontAwesomeIcon icon={faTrophy} className="sp-stat-icon" />
            <span className="sp-stat-num">{avgScore !== null ? `${avgScore}%` : '—'}</span>
            <span className="sp-stat-label">Promedio general</span>
          </div>
          <div className="sp-stat-card">
            <FontAwesomeIcon icon={faCheckCircle} className="sp-stat-icon sp-stat-icon--green" />
            <span className="sp-stat-num">{completedCount}</span>
            <span className="sp-stat-label">Completadas</span>
          </div>
        </div>

        {/* Mis Clases */}
        <div className="sp-card">
          <h3 className="sp-section-title">Mis Clases</h3>
          {isLoadingClasses ? (
            <p className="sp-state-msg">Cargando clases...</p>
          ) : myClasses.length === 0 ? (
            <p className="sp-state-msg sp-state-msg--empty">
              No estás inscrito en ninguna clase todavía.
            </p>
          ) : (
            <div className="sp-classes-list">
              {myClasses.map((cls) => (
                <div key={cls.id} className="sp-class-item">
                  <span
                    className="sp-class-color"
                    style={{ backgroundColor: cls.color_class || '#3b82f6' }}
                  />
                  <div className="sp-class-info">
                    <p className="sp-class-name">{cls.nombre_class}</p>
                    {cls.descrip_class && (
                      <p className="sp-class-desc">{cls.descrip_class}</p>
                    )}
                    {cls.fechaInscripcion && (
                      <p className="sp-class-date">
                        Inscrito: {new Date(cls.fechaInscripcion).toLocaleDateString('es-MX', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historial */}
        <div className="sp-card">
          <h3 className="sp-section-title">Historial de encuestas</h3>
          {isLoadingHistory ? (
            <p className="sp-state-msg">Cargando historial...</p>
          ) : history.length === 0 ? (
            <p className="sp-state-msg sp-state-msg--empty">
              Aún no has respondido ninguna encuesta.
            </p>
          ) : (
            <div className="sp-history-list">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="sp-history-item"
                  onClick={() => navigate(`/student/poll/${item.pollId}/results`)}
                >
                  <div className="sp-history-left">
                    <FontAwesomeIcon
                      icon={item.score !== undefined ? faCheckCircle : faClock}
                      className="sp-history-icon"
                      style={{ color: getScoreColor(item.percentage) }}
                    />
                    <div>
                      <p className="sp-history-poll">Encuesta #{item.pollId}</p>
                      <p className="sp-history-date">
                        {new Date(item.submittedAt).toLocaleDateString('es-MX', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="sp-history-score" style={{ color: getScoreColor(item.percentage) }}>
                    {item.percentage !== undefined ? `${item.percentage}%` : '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
