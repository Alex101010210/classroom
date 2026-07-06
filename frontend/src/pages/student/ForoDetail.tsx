import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendar, faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
import { foroService, ForoData } from '../../services/api';
import '../teacher/ForoDetail.css';

const StudentForoDetail: React.FC = () => {
  const navigate = useNavigate();
  const [foros, setForos] = useState<ForoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    foroService.getForos()
      .then(data => setForos(data))
      .catch(() => setForos([]))
      .finally(() => setIsLoading(false));
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
      <header className="app-header">
        <button className="app-header-back" onClick={() => navigate('/student/dashboard')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver</span>
        </button>
        <h1 className="app-header-title">Foros Académicos</h1>
        <div className="app-header-actions">
          <button
            className="app-header-icon-btn"
            onClick={() => navigate('/student/profile')}
            aria-label="Mi Perfil"
            title="Mi Perfil"
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="foro-detail-container">
        <div className="foro-detail-header">
          <h1>Foros</h1>
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
