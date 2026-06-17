import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

interface Subject {
  id: string;
  name: string;
  description?: string;
  students?: string[];
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [teacherName] = useState('Nombre del maestro');

  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  const handleAddSubject = () => {
    navigate('/teacher/clases');
  };

  const handleUsers = () => {
    alert('Gestión de usuarios - Funcionalidad por implementar');
  };

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea salir?')) {
      window.location.href = '/login';
    }
  };

  const handleSubjectClick = (subject: Subject) => {
    alert(`Seleccionó la materia: ${subject.name}`);
    setIsSubjectsOpen(false);
  };

  const handleForos = () => {
    alert('Foros - Funcionalidad por implementar');
  };

  const handleAvisos = () => {
    alert('Avisos - Funcionalidad por implementar');
  };

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <div className="header-logo">
          <h1>Logo</h1>
        </div>
        <div className="header-actions">
          <button className="btn-header btn-add" onClick={handleAddSubject}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button className="btn-header btn-users" onClick={handleUsers}>
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <div className="welcome-content">
            <h2 className="welcome-text">
              Bienvenido ({teacherName} que hace el registro)
            </h2>
            <div className="classes-preview-panel">
              {subjects.length === 0 ? (
                <p className="empty-classes-message">Aún no hay clases creadas.</p>
              ) : (
                <div className="classes-preview-list">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="class-preview-card">
                      <h3>{subject.name}</h3>
                      {subject.description && <p>{subject.description}</p>}
                      {subject.students && subject.students.length > 0 && (
                        <span>{subject.students.length} alumnos</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="dashboard-sidebar">
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
                Materias ↓
              </button>

              {isSubjectsOpen && (
                <div className="dropdown-menu">
                  {subjects.length === 0 ? (
                    <div className="dropdown-item empty">
                      No hay materias agregadas
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

            <button className="sidebar-btn btn-logout" onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>Salir</span>
            </button>
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default TeacherDashboard;

// Made with Bob