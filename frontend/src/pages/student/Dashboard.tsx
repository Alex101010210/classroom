import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faBars } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

interface Subject {
  id: string;
  name: string;
  description?: string;
  students?: string[];
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [studentName] = useState('Nombre del estudiante');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    //Cargar clases desde la API donde el estudiante está inscrito
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea salir?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const handleSubjectClick = (subject: Subject) => {
    alert(`Ver tareas de: ${subject.name}`);
    setIsSubjectsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleForos = () => {
    setIsMobileMenuOpen(false);
    alert('Foros - Funcionalidad por implementar');
  };

  const handleAvisos = () => {
    setIsMobileMenuOpen(false);
    alert('Avisos - Funcionalidad por implementar');
  };

  const handleMisResultados = () => {
    setIsMobileMenuOpen(false);
    alert('Mis Resultados - Funcionalidad por implementar');
  };

  return (
    <div className="student-dashboard">
      <header className="dashboard-header student">
        <div className="header-logo">
          <h1>Logo</h1>
        </div>
        <div className="header-actions">
          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <div className="welcome-content">
            <h2 className="welcome-text">
              Bienvenido {studentName}
            </h2>
            <div className="classes-preview-panel">
              {subjects.length === 0 ? (
                <p className="empty-classes-message">No estás inscrito en ninguna clase.</p>
              ) : (
                <div className="classes-preview-list">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="class-preview-card read-only">
                      <h3>{subject.name}</h3>
                      {subject.description && <p>{subject.description}</p>}
                      <button className="btn-view-tasks">📝 Ver Tareas</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className={`dashboard-sidebar student ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <nav className="sidebar-nav">
            <button className="sidebar-btn" onClick={handleForos}>
              Foros
            </button>

            <button className="sidebar-btn" onClick={handleAvisos}>
              Avisos
            </button>

            <div className="sidebar-dropdown">
              <button
                className="sidebar-btn dropdown-toggle"
                onClick={() => setIsSubjectsOpen(!isSubjectsOpen)}
              >
                Mis Clases ↓
              </button>

              {isSubjectsOpen && (
                <div className="dropdown-menu">
                  {subjects.length === 0 ? (
                    <div className="dropdown-item empty">
                      No estás inscrito en clases
                    </div>
                  ) : (
                    subjects.map((subject) => (
                      <button
                        key={subject.id}
                        className="dropdown-item"
                        onClick={() => handleSubjectClick(subject)}
                      >
                        {subject.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button className="sidebar-btn" onClick={handleMisResultados}>
              Mis Resultados
            </button>

            <button className="sidebar-btn btn-logout" onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>Salir</span>
            </button>
          </nav>
        </aside>

        {isMobileMenuOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;