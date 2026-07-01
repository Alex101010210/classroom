import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faUser,
  faEnvelope,
  faCheckCircle,
  faFileAlt,
  faPollH,
  faTrophy,
  faBook,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/authService';
import { enrollmentService, resultadosService, ResultadoItem, StudentClass } from '../../services/api';
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
  const [user, setUser]               = useState<UserData | null>(null);
  const [resultados, setResultados]   = useState<ResultadoItem[]>([]);
  const [myClasses, setMyClasses]     = useState<StudentClass[]>([]);
  const [isLoadingRes, setIsLoadingRes] = useState(true);
  const [isLoadingCls, setIsLoadingCls] = useState(true);
  const [tab, setTab] = useState<'todos' | 'encuestas' | 'examenes'>('todos');

  useEffect(() => {
    setUser(authService.getCurrentUser());

    resultadosService.getMisResultados()
      .then(data => setResultados(data))
      .catch(() => setResultados([]))
      .finally(() => setIsLoadingRes(false));

    enrollmentService.getMyClasses()
      .then(data => setMyClasses(data))
      .catch(() => setMyClasses([]))
      .finally(() => setIsLoadingCls(false));
  }, []);

  const getScoreColor = (pct: number | null) => {
    if (pct === null) return '#57606a';
    if (pct >= 80) return '#10B981';
    if (pct >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const encuestas  = resultados.filter(r => r.tipo === 'encuesta');
  const examenes   = resultados.filter(r => r.tipo === 'examen');
  // El promedio solo considera exámenes con calificación (las encuestas no llevan nota)
  const examenesConNota = examenes.filter(r => r.porcentaje !== null);
  const promedio   = examenesConNota.length > 0
    ? Math.round(examenesConNota.reduce((s, r) => s + (r.porcentaje ?? 0), 0) / examenesConNota.length)
    : null;

  const listaActiva = tab === 'encuestas' ? encuestas
    : tab === 'examenes' ? examenes
    : resultados;

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

        {/* Tarjeta usuario */}
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
            <FontAwesomeIcon icon={faPollH} className="sp-stat-icon" />
            <span className="sp-stat-num">{encuestas.length}</span>
            <span className="sp-stat-label">Encuestas</span>
          </div>
          <div className="sp-stat-card">
            <FontAwesomeIcon icon={faFileAlt} className="sp-stat-icon" />
            <span className="sp-stat-num">{examenes.length}</span>
            <span className="sp-stat-label">Exámenes</span>
          </div>
          <div className="sp-stat-card">
            <FontAwesomeIcon icon={faTrophy} className="sp-stat-icon sp-stat-icon--gold" />
            <span className="sp-stat-num" style={{ color: promedio !== null ? getScoreColor(promedio) : undefined }}>
              {promedio !== null ? `${promedio}%` : '—'}
            </span>
            <span className="sp-stat-label">Promedio</span>
          </div>
        </div>

        {/* Mis Clases */}
        <div className="sp-card">
          <h3 className="sp-section-title">
            <FontAwesomeIcon icon={faBook} /> Mis Clases
          </h3>
          {isLoadingCls ? (
            <p className="sp-state-msg">Cargando clases...</p>
          ) : myClasses.length === 0 ? (
            <p className="sp-state-msg sp-state-msg--empty">No estás inscrito en ninguna clase todavía.</p>
          ) : (
            <div className="sp-classes-list">
              {myClasses.map((cls) => (
                <div key={cls.id} className="sp-class-item">
                  <span className="sp-class-color" style={{ backgroundColor: cls.color_class || '#3b82f6' }} />
                  <div className="sp-class-info">
                    <p className="sp-class-name">{cls.nombre_class}</p>
                    {cls.descrip_class && <p className="sp-class-desc">{cls.descrip_class}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historial de resultados */}
        <div className="sp-card">
          <h3 className="sp-section-title">
            <FontAwesomeIcon icon={faClipboardList} /> Mis Resultados
          </h3>

          {/* Tabs */}
          <div className="sp-tabs">
            <button className={`sp-tab ${tab === 'todos'     ? 'active' : ''}`} onClick={() => setTab('todos')}>
              Todos ({resultados.length})
            </button>
            <button className={`sp-tab ${tab === 'examenes'  ? 'active' : ''}`} onClick={() => setTab('examenes')}>
              Exámenes ({examenes.length})
            </button>
            <button className={`sp-tab ${tab === 'encuestas' ? 'active' : ''}`} onClick={() => setTab('encuestas')}>
              Encuestas ({encuestas.length})
            </button>
          </div>

          {isLoadingRes ? (
            <p className="sp-state-msg">Cargando resultados...</p>
          ) : listaActiva.length === 0 ? (
            <p className="sp-state-msg sp-state-msg--empty">
              Aún no tienes {tab === 'todos' ? 'actividades completadas' : tab} registradas.
            </p>
          ) : (
            <div className="sp-history-list">
              {listaActiva.map((item) => (
                <div key={`${item.tipo}-${item.id}`} className="sp-history-item">
                  <div className="sp-history-left">
                    <FontAwesomeIcon
                      icon={item.tipo === 'examen' ? faFileAlt : faPollH}
                      className="sp-history-type-icon"
                      style={{ color: item.tipo === 'examen' ? '#3b82d4' : '#7c5cd8' }}
                    />
                    <div>
                      <p className="sp-history-title">{item.titulo}</p>
                      <p className="sp-history-meta">
                        <span className={`sp-tipo-badge sp-tipo-badge--${item.tipo}`}>
                          {item.tipo === 'examen' ? 'Examen' : 'Encuesta'}
                        </span>
                        <span className="sp-history-date">
                          {new Date(item.submitted_at).toLocaleDateString('es-MX', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="sp-history-right">
                    {item.porcentaje !== null ? (
                      <>
                        <span
                          className="sp-history-pct"
                          style={{ color: getScoreColor(item.porcentaje) }}
                        >
                          {item.porcentaje}%
                        </span>
                        <span className="sp-history-pts">
                          {item.calificacion} / {item.calificacion_max} pts
                        </span>
                      </>
                    ) : (
                      <span className="sp-history-check">
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#10B981' }} /> Enviada
                      </span>
                    )}
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
