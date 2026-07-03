import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { avisoService, AvisoData } from '../../services/api';
import './StudentAvisos.css';

const StudentAvisos: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();

  const [avisos, setAvisos] = useState<AvisoData[]>([]);
  const [className, setClassName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Intentar obtener el nombre de la clase desde localStorage
    const stored: any[] = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const found = stored.find((c: any) => String(c.id) === String(classId));
    if (found) setClassName(found.nombre_class || found.name || '');
  }, [classId]);

  useEffect(() => {
    if (!classId) return;
    avisoService.getByClase(classId)
      .then(setAvisos)
      .catch(() => setError('No se pudieron cargar los avisos.'))
      .finally(() => setIsLoading(false));
  }, [classId]);

  const formatFecha = (dateString: string) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="student-avisos-page">
      <header className="app-header">
        <button className="app-header-back" onClick={() => navigate('/student/dashboard')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver</span>
        </button>
        <h1 className="app-header-title">
          {className ? `Avisos — ${className}` : 'Avisos'}
        </h1>
        <div className="app-header-actions">
          <button
            className="app-header-btn"
            onClick={() => navigate(`/student/class/${classId}/polls`)}
          >
            Ver actividades
          </button>
        </div>
      </header>

      <div className="sa-container">
        <div className="sa-title-row">
          <FontAwesomeIcon icon={faBullhorn} className="sa-title-icon" />
          <h2>Avisos{className ? ` — ${className}` : ''}</h2>
        </div>

        {isLoading ? (
          <p className="sa-status">Cargando avisos...</p>
        ) : error ? (
          <p className="sa-status sa-status--error">{error}</p>
        ) : avisos.length === 0 ? (
          <div className="sa-empty">
            <FontAwesomeIcon icon={faBullhorn} className="sa-empty-icon" />
            <p>No hay avisos publicados para esta clase.</p>
          </div>
        ) : (
          <div className="sa-lista">
            {avisos.map(aviso => (
              <div key={aviso.id} className="sa-aviso-card">
                <div className="sa-aviso-top">
                  <span className="sa-aviso-tag">📢 Aviso</span>
                  <span className="sa-aviso-fecha">{formatFecha(aviso.fecha)}</span>
                </div>
                <p className="sa-aviso-mensaje">{aviso.mensaje}</p>
                <p className="sa-aviso-atentamente">Atentamente: {aviso.nombre_maestro}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAvisos;
