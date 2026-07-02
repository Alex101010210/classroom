import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faPlus, faCalendar, faUsers } from '@fortawesome/free-solid-svg-icons';
import { foroService, ForoData } from '../../services/api';
import './ForoDetail.css';

const ForoDetail: React.FC = () => {
  const navigate = useNavigate();
  const [foros, setForos] = useState<ForoData[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    foroService.getForos()
      .then(data => setForos(data))
      .catch(() => setForos([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleBack = () => navigate('/teacher/dashboard');
  const handleCreateForo = () => navigate('/teacher/foro');
  const handleUsers = () => setShowUserMenu(!showUserMenu);

  const handleProfile = () => {
    setShowUserMenu(false);
    alert('Perfil de usuario - Funcionalidad por implementar');
  };

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea salir?')) {
      localStorage.clear();
      navigate('/login');
    }
  };


  const formatDate = (dateString: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="foro-detail-page">
      <header className="dashboard-header">
        <div className="header-logo">
          <button className="btn-back" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1>Logo</h1>
        </div>
        <div className="header-actions">
          <button className="btn-header btn-add" onClick={handleCreateForo}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <div className="user-menu-container">
            <button className="btn-header btn-users" onClick={handleUsers}>
              <FontAwesomeIcon icon={faUser} />
            </button>
            {showUserMenu && (
              <div className="user-dropdown-menu">
                <button className="user-menu-item" onClick={handleProfile}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Mi Perfil</span>
                </button>
                <button className="user-menu-item logout" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="foro-detail-container">
        <div className="foro-detail-header">
          <h1>Foros Académicos</h1>
          <button className="btn-create-foro" onClick={handleCreateForo}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Crear Nuevo Foro</span>
          </button>
        </div>

        {isLoading ? (
          <div className="empty-state">
            <p>Cargando foros...</p>
          </div>
        ) : foros.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h2>No hay foros creados</h2>
            <p>Crea tu primer foro académico para comenzar las discusiones con tus estudiantes</p>
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
                  
                </div>

                <div className="foro-card-body">
                  {foro.descrip_foro && (
                    <div className="foro-section">
                      <h4>Descripción</h4>
                      <p>{foro.descrip_foro}</p>
                    </div>
                  )}

                  <div className="foro-section">
                    <h4>Objetivo de Aprendizaje</h4>
                    <p>{foro.obejtivo_foro}</p>
                  </div>

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
                  <button className="btn-view-discussions" onClick={() => navigate(`/teacher/discusiones/${foro.id}`)}>
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

export default ForoDetail;
