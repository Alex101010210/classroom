import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faRightFromBracket,
  faBars,
  faComments,
  faClipboardList,
  faFileAlt,
  faPollH,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { classService } from '../../services/api';
import './VerEncuestas.css';

interface Subject {
  id: string;
  nombre_class?: string;
  name?: string;
  descrip_class?: string;
  description?: string;
  color_class?: string;
  color?: string;
  student_count?: number;
}

const VerEncuestas: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [isForosOpen, setIsForosOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const userMenuRef = useRef<HTMLDivElement>(null);
  const forosRef = useRef<HTMLDivElement>(null);
  const subjectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (forosRef.current && !forosRef.current.contains(e.target as Node)) {
        setIsForosOpen(false);
      }
      if (subjectsRef.current && !subjectsRef.current.contains(e.target as Node)) {
        setIsSubjectsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const loadClasses = async () => {
    try {
      setIsLoading(true);
      setLoadError('');
      const response = await classService.getTeacherClasses();
      setSubjects(response.classes || []);
    } catch (error: any) {
      console.error('Error al cargar clases:', error);
      setLoadError('No se pudo cargar las clases.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea salir?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const handleSubjectClick = (subject: Subject) => {
    navigate(`/teacher/encuestas`, { state: { subject } });
    setIsSubjectsOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="ve-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-logo">
          <h1>Logo</h1>
        </div>
        <div className="header-actions">
          <div className="user-menu-container" ref={userMenuRef}>
            <button className="btn-header btn-users" onClick={() => setShowUserMenu(!showUserMenu)}>
              <FontAwesomeIcon icon={faUser} />
            </button>
            {showUserMenu && (
              <div className="user-dropdown-menu">
                <button className="user-menu-item" onClick={() => { setShowUserMenu(false); navigate('/teacher/profile'); }}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Mi Perfil</span>
                </button>
                <button className="user-menu-item logout" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Main content */}
        <div className="ve-main">
          <h1 className="ve-title">Encuestas</h1>

          {isLoading ? (
            <p className="ve-empty">Cargando clases...</p>
          ) : loadError ? (
            <p className="ve-empty ve-empty--error">{loadError}</p>
          ) : subjects.length === 0 ? (
            <p className="ve-empty">No hay clases disponibles.</p>
          ) : (
            <div className="classes-preview-list">
              {subjects.map((subject) => {
                const displayName = subject.nombre_class || subject.name || 'Sin nombre';
                const displayDescription = subject.descrip_class || subject.description;
                const displayColor = subject.color_class || subject.color || '#3b82f6';

                return (
                  <div
                    key={subject.id}
                    className="class-preview-card"
                    onClick={() => handleSubjectClick(subject)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className="card-color-banner"
                      style={{ backgroundColor: displayColor }}
                    >
                      <h3>{displayName}</h3>
                    </div>
                    <div className="card-body">
                      {displayDescription ? (
                        <p className="subject-description">{displayDescription}</p>
                      ) : (
                        <p className="subject-description" style={{ color: '#adb5bd', fontStyle: 'italic' }}>Sin descripción</p>
                      )}
                      <div className="subject-info">
                        <p className="total-students">
                          <FontAwesomeIcon icon={faUser} />
                          Total de alumnos: {subject.student_count ?? 0}
                        </p>
                        <span className="status-badge" style={{ color: displayColor, borderColor: displayColor }}>
                          Activa
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-tools-label">Herramientas</div>
          <nav className="sidebar-nav">
            <div className="foro-btn-container" ref={forosRef}>
              <button
                className={`sidebar-btn${isForosOpen ? ' sidebar-btn--active' : ''}`}
                onClick={() => setIsForosOpen(!isForosOpen)}
              >
                <FontAwesomeIcon icon={faComments} />
                Foros
              </button>
              {isForosOpen && (
                <div className="foro-btn-dropdown">
                  <button className="user-menu-item" onClick={() => { setIsMobileMenuOpen(false); setIsForosOpen(false); navigate('/teacher/foros-list'); }}>
                    <FontAwesomeIcon icon={faComments} />
                    <span>Ver Foros</span>
                  </button>
                  <button className="user-menu-item" onClick={() => { setIsMobileMenuOpen(false); setIsForosOpen(false); navigate('/teacher/foro'); }}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <span>Crear Foro</span>
                  </button>
                </div>
              )}
            </div>

            <button className="sidebar-btn" onClick={() => { setIsMobileMenuOpen(false); navigate('/teacher/avisos'); }}>
              <FontAwesomeIcon icon={faClipboardList} />
              Avisos
            </button>

            <button className="sidebar-btn sidebar-btn--active" onClick={() => navigate('/teacher/ver-encuestas')}>
              <FontAwesomeIcon icon={faPollH} />
              Ver encuestas
            </button>

            <div className="sidebar-dropdown" ref={subjectsRef}>
              <button
                className={`sidebar-btn dropdown-toggle${isSubjectsOpen ? ' sidebar-btn--active' : ''}`}
                onClick={() => setIsSubjectsOpen(!isSubjectsOpen)}
              >
                <FontAwesomeIcon icon={faFileAlt} />
                Materias {isSubjectsOpen ? '↑' : '↓'}
              </button>
              {isSubjectsOpen && (
                <div className="dropdown-menu">
                  {subjects.length === 0 ? (
                    <div className="dropdown-item empty">No hay materias agregadas</div>
                  ) : (
                    subjects.map((subject) => (
                      <button
                        key={subject.id}
                        className="dropdown-item"
                        onClick={() => handleSubjectClick(subject)}
                      >
                        {subject.nombre_class || subject.name || 'Sin nombre'}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </nav>
        </aside>

        {isMobileMenuOpen && (
          <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default VerEncuestas;
