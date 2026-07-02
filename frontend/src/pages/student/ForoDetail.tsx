import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faCalendar, faUsers, faTrash, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/authService';
import '../teacher/ForoDetail.css';

interface Foro {
  id: string;
  titulo: string;
  descripcion: string;
  objetivo: string;
  preguntaDetonadora: string;
  fechaInicio: string;
  fechaLimite: string;
  materialApoyo?: string;
  enlace?: string;
  createdAt: string;
}

const StudentForoDetail: React.FC = () => {
  const navigate = useNavigate();
  const [foros, setForos] = useState<Foro[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentUser = authService.getCurrentUser();
  const studentName = currentUser
    ? `${currentUser.nombre} ${currentUser.apellido || ''}`.trim()
    : 'Estudiante';

  useEffect(() => {
    const savedForos = localStorage.getItem('student_foros');
    if (savedForos) {
      setForos(JSON.parse(savedForos));
    }
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

  const handleBack = () => {
    navigate('/student/dashboard');
  };

  const handleCreateForo = () => {
    navigate('/student/foro');
  };

  const handleDeleteForo = (foroId: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este foro?')) {
      const updatedForos = foros.filter(f => f.id !== foroId);
      setForos(updatedForos);
      localStorage.setItem('student_foros', JSON.stringify(updatedForos));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="foro-detail-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-logo">
          <button className="btn-back" onClick={handleBack}>
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
          <button className="btn-create-foro" onClick={handleCreateForo}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Crear Nuevo Foro</span>
          </button>
        </div>

        {foros.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h2>No hay foros creados</h2>
            <p>Crea tu primer foro académico para comenzar las discusiones con otros estudiantes</p>
            <button className="btn-create-first" onClick={handleCreateForo}>
              <FontAwesomeIcon icon={faPlus} />
              Crear Primer Foro
            </button>
          </div>
        ) : (
          <div className="foros-grid">
            {foros.map((foro) => (
              <div key={foro.id} className="foro-card">
                <div className="foro-card-header">
                  <h3>{foro.titulo}</h3>
                  <button 
                    className="btn-delete-foro"
                    onClick={() => handleDeleteForo(foro.id)}
                    title="Eliminar foro"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>

                <div className="foro-card-body">
                  <div className="foro-section">
                    <h4>Descripción</h4>
                    <p>{foro.descripcion}</p>
                  </div>

                  <div className="foro-section">
                    <h4>Objetivo de Aprendizaje</h4>
                    <p>{foro.objetivo}</p>
                  </div>

                  <div className="foro-section">
                    <h4>Pregunta Detonadora</h4>
                    <p className="pregunta-detonadora">{foro.preguntaDetonadora}</p>
                  </div>

                  {foro.enlace && (
                    <div className="foro-section">
                      <h4>Material de Apoyo</h4>
                      <a href={foro.enlace} target="_blank" rel="noopener noreferrer" className="material-link">
                        {foro.enlace}
                      </a>
                    </div>
                  )}

                  <div className="foro-meta">
                    <div className="meta-item">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>Inicio: {formatDate(foro.fechaInicio)}</span>
                    </div>
                    <div className="meta-item">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>Límite: {formatDate(foro.fechaLimite)}</span>
                    </div>
                  </div>

                  <div className="foro-badge">
                    <span className="badge-open">FORO ABIERTO</span>
                  </div>
                </div>

                <div className="foro-card-footer">
                  <button className="btn-view-discussions" onClick={() => navigate(`/student/discusiones/${foro.id}`)}>
                    <FontAwesomeIcon icon={faUsers} />
                    Ver Discusiones
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
