import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightFromBracket,
  faBars,
  faXmark,
  faBookOpen,
  faClipboardList,
  faChevronDown,
  faChevronUp,
  faUser,
  faComments,
  faPenToSquare,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/authService';
import { enrollmentService } from '../../services/api';
import './Dashboard.css';

interface Class {
  id: number;
  nombre_class?: string;
  name?: string;
  descrip_class?: string | null;
  description?: string;
  color_class?: string | null;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isClassesOpen, setIsClassesOpen] = useState(false);
  const [isForosOpen, setIsForosOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const forosRef = useRef<HTMLDivElement>(null);

  const user = authService.getCurrentUser();
  const studentName = user
    ? `${user.nombre} ${user.apellido || ''}`.trim()
    : 'Estudiante';

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (forosRef.current && !forosRef.current.contains(e.target as Node)) {
        setIsForosOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const loadClasses = async () => {
    try {
      setIsLoading(true);
      setError('');
      const classes = await enrollmentService.getMyClasses();
      setClasses(classes);
      localStorage.setItem('myClasses', JSON.stringify(classes));
    } catch (err) {
      console.error('Error al cargar clases:', err);
      setError('No se pudieron cargar las clases.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas salir?')) {
      authService.logout();
      navigate('/login');
    }
  };

  const handleCreateForo = () => {
    setIsMobileMenuOpen(false);
    setIsForosOpen(false);
    navigate('/student/foro');
  };

  const handleVerForos = () => {
    setIsMobileMenuOpen(false);
    setIsForosOpen(false);
    navigate('/student/foros-list');
  };

  const handleClassClick = (cls: Class) => {
    setIsMobileMenuOpen(false);
    navigate(`/student/class/${cls.id}/polls`);
  };

  const getDisplayName = (cls: Class) =>
    cls.nombre_class || cls.name || 'Sin nombre';

  const getDisplayColor = (cls: Class) =>
    cls.color_class || '#4F46E5';

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="sd-header">
        <div className="sd-header-logo">
          <span className="sd-logo-text">PollClass</span>
        </div>
        <div className="sd-header-user">
          <span className="sd-user-name">{studentName}</span>
          <span className="sd-user-badge">Alumno</span>
        </div>
        <button
          className="sd-hamburger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menú"
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} />
        </button>
      </header>

      <div className="sd-body">
        {/* Contenido principal */}
        <main className="sd-main">
          <div className="sd-welcome">
            <h2>Bienvenido, <span>{studentName}</span></h2>
            <p>Selecciona una clase para ver sus encuestas.</p>
          </div>

          {error && (
            <div className="sd-error">
              <p>{error}</p>
              <button onClick={loadClasses}>Reintentar</button>
            </div>
          )}

          {isLoading ? (
            <div className="sd-loading">
              <p>Cargando clases...</p>
            </div>
          ) : classes.length === 0 && !error ? (
            <div className="sd-empty">
              <FontAwesomeIcon icon={faBookOpen} className="sd-empty-icon" />
              <p>No estás inscrito en ninguna clase aún.</p>
            </div>
          ) : (
            <div className="sd-classes-grid">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  className="sd-class-card"
                  style={{ borderTopColor: getDisplayColor(cls) }}
                  onClick={() => handleClassClick(cls)}
                >
                  <div
                    className="sd-class-color-dot"
                    style={{ backgroundColor: getDisplayColor(cls) }}
                  />
                  <h3 className="sd-class-name">{getDisplayName(cls)}</h3>
                  {(cls.descrip_class || cls.description) && (
                    <p className="sd-class-desc">
                      {cls.descrip_class || cls.description}
                    </p>
                  )}
                  <span className="sd-class-cta">
                    <FontAwesomeIcon icon={faClipboardList} /> Ver actividades
                  </span>
                </button>
              ))}
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className={`sd-sidebar ${isMobileMenuOpen ? 'sd-sidebar--open' : ''}`}>
          <nav className="sd-nav">
            <div className="sd-nav-section">
              <p className="sd-nav-label">Menú</p>

              {/* Mis Clases */}
              <button
                className="sd-nav-btn"
                onClick={() => setIsClassesOpen(!isClassesOpen)}
              >
                <FontAwesomeIcon icon={faBookOpen} />
                <span>Mis Clases</span>
                <FontAwesomeIcon
                  icon={isClassesOpen ? faChevronUp : faChevronDown}
                  className="sd-nav-chevron"
                />
              </button>

              {isClassesOpen && (
                <div className="sd-nav-dropdown">
                  {classes.length === 0 ? (
                    <span className="sd-nav-dropdown-empty">
                      Sin clases inscritas
                    </span>
                  ) : (
                    classes.map((cls) => (
                      <button
                        key={cls.id}
                        className="sd-nav-dropdown-item"
                        onClick={() => handleClassClick(cls)}
                      >
                        <span
                          className="sd-nav-dropdown-dot"
                          style={{ backgroundColor: getDisplayColor(cls) }}
                        />
                        {getDisplayName(cls)}
                      </button>
                    ))
                  )}
                </div>
              )}

              <button className="sd-nav-btn" onClick={() => navigate('/student/results')}>
                <FontAwesomeIcon icon={faChartBar} />
                <span>Mis Resultados</span>
              </button>

              {/* Foros */}
              <div className="sd-foros-container" ref={forosRef}>
                <button
                  className={`sd-nav-btn${isForosOpen ? ' sd-nav-btn--active' : ''}`}
                  onClick={() => setIsForosOpen(!isForosOpen)}
                >
                  <FontAwesomeIcon icon={faComments} />
                  <span>Foros</span>
                  <FontAwesomeIcon
                    icon={isForosOpen ? faChevronUp : faChevronDown}
                    className="sd-nav-chevron"
                  />
                </button>

                {isForosOpen && (
                  <div className="sd-foros-dropdown">
                    <button className="sd-foros-dropdown-item" onClick={handleVerForos}>
                      <FontAwesomeIcon icon={faComments} />
                      <span>Ver Foros</span>
                    </button>
                    <button className="sd-foros-dropdown-item" onClick={handleCreateForo}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                      <span>Crear Foro</span>
                    </button>
                  </div>
                )}
              </div>

              <button className="sd-nav-btn" onClick={() => navigate('/student/profile')}>
                <FontAwesomeIcon icon={faUser} />
                <span>Mi Perfil</span>
              </button>
            </div>

            <div className="sd-nav-section sd-nav-section--bottom">
              <button className="sd-nav-btn sd-nav-btn--logout" onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>Salir</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Overlay mobile */}
        {isMobileMenuOpen && (
          <div
            className="sd-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;