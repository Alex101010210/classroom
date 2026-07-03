import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendar, faUsers, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/authService';
import { foroService, ForoData } from '../../services/api';
import '../teacher/ForoDetail.css';

const StudentForoDetail: React.FC = () => {
  const navigate = useNavigate();
  const [foros, setForos] = useState<ForoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentUser = authService.getCurrentUser();
  const studentName = currentUser
    ? `${currentUser.nombre} ${currentUser.apellido || ''}`.trim()
    : 'Estudiante';

  useEffect(() => {
    foroService.getForos()
      .then(data => setForos(data))
      .catch(() => setForos([]))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="foro-detail-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-logo">
          <button className="btn-back" onClick={() => navigate('/student/dashboard')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <span className="header-logo-text">PollClass</span>
        </div>
        <div className="header-actions">
          <div className="user-menu-container" ref={userMenuRef}>
            <button className="btn-header btn-users" onClick={() => setShowUserMenu(!showUserMenu)}>
              <FontAwesomeIcon icon={faUser} />
            </button>
            {showUserMenu && (
              <div className="user-dropdown-menu">
                <div className="user-menu-name">{studentName}</div>
                <button className="user-menu-item" onClick={() => { setShowUserMenu(false); navigate('/student/profile'); }}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Mi Perfil</span>
                </button>
                <button className="user-menu-item logout" onClick={() => { if (window.confirm('¿Estás seguro que deseas salir?')) { authService.logout(); navigate('/login'); } }}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="foro-detail-container">
        <div className="foro-detail-header">
          <h1>Foros Académicos</h1>
        </div>

        {isLoading ? (
          <div className="empty-state"><p>Cargando foros...</p></div>
        ) : foros.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h2>No hay foros disponibles</h2>
            <p>Tu maestro aún no ha creado ningún foro académico.</p>
          </div>
        ) : (
          <div className="foros-grid">
            {foros.map((foro) => (
              <div key={foro.id} className="foro-card">
                <div className="foro-card-header">
                  <h3>{foro.titulo}</h3>
                </div>

                <div className="foro-card-body">
                  {foro.descrip_foro && (
                    <div className="foro-section">
                      <h4>Descripción</h4>
                      <p>{foro.descrip_foro}</p>
                    </div>
                  )}
                  <div className="foro-section">
                    <h4>Pregunta Detonadora</h4>
                    <p className="pregunta-detonadora">{foro.pregunta}</p>
                  </div>
                  {foro.links && (
                    <div className="foro-section">
                      <h4>Material de Apoyo</h4>
                      <a href={foro.links} target="_blank" rel="noopener noreferrer" className="material-link">
                        {foro.links}
                      </a>
                    </div>
                  )}
                  <div className="foro-meta">
                    <div className="meta-item">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>Inicio: {formatDate(foro.fecha_inicio)}</span>
                    </div>
                    <div className="meta-item">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>Límite: {formatDate(foro.fecha_fin)}</span>
                    </div>
                  </div>
                  <div className="foro-badge">
                    <span className="badge-open">FORO ABIERTO</span>
                  </div>
                </div>

                <div className="foro-card-footer">
                  <button className="btn-view-discussions" onClick={() => navigate(`/student/discusiones/${foro.id}`)}>
                    <FontAwesomeIcon icon={faUsers} />
                    Participar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentForoDetail;
