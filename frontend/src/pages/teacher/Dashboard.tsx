import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faRightFromBracket, faEllipsisV, faUserPlus, faClipboardList, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string;
  attachedFile?: File | null;
  submissionFile?: File | null;
}

interface Subject {
  id: string;
  name: string;
  description?: string;
  students?: string[];
  tasks?: Task[];
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [teacherName] = useState('Nombre del maestro');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  
  // Form states
  const [studentName, setStudentName] = useState('');
  const [taskForm, setTaskForm] = useState<Task>({
    id: '',
    name: '',
    description: '',
    deadline: '',
    attachedFile: null,
    submissionFile: null
  });

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
    setShowUserMenu(!showUserMenu);
  };

  const handleProfile = () => {
    setShowUserMenu(false);
    alert('Perfil de usuario - Funcionalidad por implementar');
  };

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea salir?')) {
      window.location.href = '/login';
    }
  };

  const handleSubjectClick = (subject: Subject) => {
    navigate(`/teacher/class/${subject.id}`, { state: { subject } });
    setIsSubjectsOpen(false);
  };

  const handleForos = () => {
    alert('Foros - Funcionalidad por implementar');
  };

  const handleAvisos = () => {
    alert('Avisos - Funcionalidad por implementar');
  };

  const toggleMenu = (subjectId: string) => {
    setOpenMenuId(openMenuId === subjectId ? null : subjectId);
  };

  const handleAddStudent = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowAddStudentModal(true);
    setOpenMenuId(null);
  };

  const handleAddTask = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowAddTaskModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteClass = (subject: Subject) => {
    if (window.confirm(`¿Está seguro que desea eliminar la clase "${subject.name}"? Esta acción no se puede deshacer.`)) {
      const updatedSubjects = subjects.filter(s => s.id !== subject.id);
      setSubjects(updatedSubjects);
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      alert('Clase eliminada exitosamente');
    }
    setOpenMenuId(null);
  };

  const submitAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim() && selectedSubject) {
      const updatedSubjects = subjects.map(subject => {
        if (subject.id === selectedSubject.id) {
          return {
            ...subject,
            students: [...(subject.students || []), studentName.trim()]
          };
        }
        return subject;
      });
      
      setSubjects(updatedSubjects);
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      setStudentName('');
      setShowAddStudentModal(false);
      setSelectedSubject(null);
    }
  };

  const submitAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskForm.name.trim() && selectedSubject) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: taskForm.name,
        description: taskForm.description,
        deadline: taskForm.deadline,
        attachedFile: taskForm.attachedFile,
        submissionFile: taskForm.submissionFile
      };

      const updatedSubjects = subjects.map(subject => {
        if (subject.id === selectedSubject.id) {
          return {
            ...subject,
            tasks: [...(subject.tasks || []), newTask]
          };
        }
        return subject;
      });
      
      setSubjects(updatedSubjects);
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      setTaskForm({
        id: '',
        name: '',
        description: '',
        deadline: '',
        attachedFile: null,
        submissionFile: null
      });
      setShowAddTaskModal(false);
      setSelectedSubject(null);
    }
  };

  const closeModals = () => {
    setShowAddStudentModal(false);
    setShowAddTaskModal(false);
    setSelectedSubject(null);
    setStudentName('');
    setTaskForm({
      id: '',
      name: '',
      description: '',
      deadline: '',
      attachedFile: null,
      submissionFile: null
    });
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
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
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
                      <div
                        className="card-content-clickable"
                        onClick={() => handleSubjectClick(subject)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-header">
                          <h3>{subject.name}</h3>
                          <div className="card-menu">
                            <button
                              className="menu-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(subject.id);
                              }}
                              aria-label="Opciones"
                            >
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </button>
                            {openMenuId === subject.id && (
                              <div className="menu-dropdown">
                                <button
                                  className="menu-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddStudent(subject);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faUserPlus} />
                                  <span>Agregar Alumno</span>
                                </button>
                                <button
                                  className="menu-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddTask(subject);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faClipboardList} />
                                  <span>Agregar Tarea</span>
                                </button>
                                <button
                                  className="menu-item delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClass(subject);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                  <span>Eliminar</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {subject.description && <p>{subject.description}</p>}
                        {subject.students && subject.students.length > 0 && (
                          <span>{subject.students.length} alumnos</span>
                        )}
                      </div>
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
          </nav>
        </aside>
      </div>

      {/* Modal: Agregar Alumno */}
      {showAddStudentModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agregar Alumno</h2>
              <button className="close-button" onClick={closeModals}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={submitAddStudent}>
              <div className="form-group">
                <label htmlFor="studentName">Nombre del Alumno</label>
                <input
                  type="text"
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ingrese el nombre completo"
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModals}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agregar Tarea */}
      {showAddTaskModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agregar Tarea</h2>
              <button className="close-button" onClick={closeModals}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={submitAddTask}>
              <div className="form-group">
                <label htmlFor="taskName">Nombre de la Tarea</label>
                <input
                  type="text"
                  id="taskName"
                  value={taskForm.name}
                  onChange={(e) => setTaskForm({...taskForm, name: e.target.value})}
                  placeholder="Ej: Tarea de Matemáticas"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="taskDescription">Descripción</label>
                <textarea
                  id="taskDescription"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  placeholder="Describe la tarea..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="taskDeadline">Tiempo de Entrega</label>
                <input
                  type="datetime-local"
                  id="taskDeadline"
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({...taskForm, deadline: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="attachedFile">Material Adjunto (Opcional)</label>
                <input
                  type="file"
                  id="attachedFile"
                  onChange={(e) => setTaskForm({...taskForm, attachedFile: e.target.files?.[0] || null})}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                />
                <small>Formatos permitidos: PDF, DOC, DOCX, PPT, PPTX, TXT, imágenes</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="submissionFile">Apartado para Enviar Archivos</label>
                <input
                  type="file"
                  id="submissionFile"
                  onChange={(e) => setTaskForm({...taskForm, submissionFile: e.target.files?.[0] || null})}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
                />
                <small>Los alumnos podrán enviar sus trabajos aquí</small>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModals}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;

// Made with Bob