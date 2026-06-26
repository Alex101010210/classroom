import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faPlus, faCalendar, faUsers, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ForoDetail.css';

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

const ForoDetail: React.FC = () => {
  const navigate = useNavigate();
  const [foros, setForos] = useState<Foro[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Cargar foros desde localStorage
    const savedForos = localStorage.getItem('foros');
    if (savedForos) {
      setForos(JSON.parse(savedForos));
    }
  }, []);

  const handleBack = () => {
    navigate('/teacher/dashboard');
  };

  const handleCreateForo = () => {
    navigate('/teacher/foro');
  };

  const handleUsers = () => {
    setShowUserMenu(!showUserMenu);
  };

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

  const handleDeleteForo = (foroId: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este foro?')) {
      const updatedForos = foros.filter(f => f.id !== foroId);
      setForos(updatedForos);
      localStorage.setItem('foros', JSON.stringify(updatedForos));
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


