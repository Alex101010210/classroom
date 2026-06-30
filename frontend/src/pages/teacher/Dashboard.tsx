import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faRightFromBracket, faEllipsisV, faClipboardList, faTrash, faTimes, faBars, faComments, faPenToSquare, faFileAlt, faPollH } from '@fortawesome/free-solid-svg-icons';
import { classService, taskService } from '../../services/api';
import './Dashboard.css';
import { authService } from '../../services/authService';

interface TaskForm {
  titulo_tarea: string;
  descrip_tarea: string;
  fecha_limite: string;
  puntos_max_tarea: string;
  entrega_tardia: boolean;
}

interface Subject {
  id: string;
  nombre_class?: string;
  name?: string;
  descrip_class?: string;
  description?: string;
  color_class?: string;
  color?: string;
  student_count?: number;
  createdAt?: string;
  created_at?: string;
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]); //Agregar mate
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);//Agregar alumno
  const [isForosOpen, setIsForosOpen] = useState(false); // Dropdown de Foros
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userMenuRef   = useRef<HTMLDivElement>(null);
  const forosRef      = useRef<HTMLDivElement>(null);
  const subjectsRef   = useRef<HTMLDivElement>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [taskForm, setTaskForm] = useState<TaskForm>({
    titulo_tarea: '',
    descrip_tarea: '',
    fecha_limite: '',
    puntos_max_tarea: '100',
    entrega_tardia: false
  });

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

  const currentUser = authService.getCurrentUser();
  const teacherName = currentUser
  ? `${currentUser.nombre} ${currentUser.apellido}`.trim()
  : 'Maestro';

  // Función para cargar clases desde la API
  const loadClasses = async () => {
    try {
      setIsLoading(true);
      const response = await classService.getTeacherClasses();
      setSubjects(response.classes || []);
    } catch (error: any) {
      console.error('Error al cargar clases:', error);
      // Fallback a localStorage si falla la API
      const savedSubjects = localStorage.getItem('subjects');
      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects));
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleUsers = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleAddSubject = () => {
    navigate('/teacher/clases')
  }

  const handleProfile = () => {
    setShowUserMenu(false);
    navigate('/teacher/profile');
  };

  const handleLogout = () => { //Cerrar sesionnnn
    if (window.confirm('¿Está seguro que desea salir?')) {
     localStorage.clear();
      navigate('/login');
    }
  };

  const handleSubjectClick = (subject: Subject) => {
    navigate(`/teacher/class/${subject.id}`, { state: { subject } });
    setIsSubjectsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleCreateForo = () => {
    setIsMobileMenuOpen(false);
    setIsForosOpen(false);
    navigate('/teacher/foro');
  };

  const handleVerForos = () => {
    setIsMobileMenuOpen(false);
    setIsForosOpen(false);
    navigate('/teacher/foros-list');
  };

  const handleAvisos = () => {
    setIsMobileMenuOpen(false);
    navigate('/teacher/avisos');
  };

  const toggleMenu = (subjectId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (openMenuId === subjectId) {
      setOpenMenuId(null);
      return;
    }
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const dropdownWidth = 200;
    // Align left edge to button's left; if it overflows viewport, align right edge to button's right
    const left = rect.left + dropdownWidth > window.innerWidth
      ? rect.right - dropdownWidth
      : rect.left;
    setMenuPos({ top: rect.bottom + 4, left });
    setOpenMenuId(subjectId);
  };

  /*const handleAddStudent = (subject: Subject) => {
    setSelectedSubject(subject);
    setOpenMenuId(null);
  };*/

  const handleAddTask = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowAddTaskModal(true);
    setOpenMenuId(null);
  };

  const handleAddExamen = (subject: Subject) => {
    setOpenMenuId(null);
    navigate('/teacher/examen', { state: { subject } });
  };

  const handleAddEncuesta = (subject: Subject) => {
    setOpenMenuId(null);
    navigate('/teacher/encuestas', { state: { subject } });
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

  const submitAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;
    setTaskError('');
    setIsSubmittingTask(true);
    try {
      await taskService.createTask(selectedSubject.id, {
        titulo_tarea: taskForm.titulo_tarea.trim(),
        descrip_tarea: taskForm.descrip_tarea.trim() || undefined,
        fecha_limite: taskForm.fecha_limite,
        puntos_max_tarea: parseInt(taskForm.puntos_max_tarea, 10) || 100,
        entrega_tardia: taskForm.entrega_tardia
      });
      setShowAddTaskModal(false);
      setSelectedSubject(null);
      setTaskForm({ titulo_tarea: '', descrip_tarea: '', fecha_limite: '', puntos_max_tarea: '100', entrega_tardia: false });
    } catch (err: any) {
      setTaskError(err.response?.data?.message || 'Error al guardar la tarea');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const closeModals = () => {
    setShowAddTaskModal(false);
    setSelectedSubject(null);
    setTaskError('');
    setTaskForm({ titulo_tarea: '', descrip_tarea: '', fecha_limite: '', puntos_max_tarea: '100', entrega_tardia: false });
  };

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <div className="header-logo">
          <h1>Logo</h1>
        </div>
        <div className="header-actions">
          <div className="add-menu-container">
            <button className="btn-header btn-add" onClick={handleAddSubject}>
            <FontAwesomeIcon icon={faPlus} />
          </button>         
          </div>
          <div className="user-menu-container" ref={userMenuRef}>
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
          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <div className="welcome-content">
            {/* Welcome banner */}
            <div className="welcome-text">
              <div className="welcome-banner-text">
                <span className="welcome-label">Panel del Maestro</span>
                <h1 className="welcome-title">
                  Bienvenido, <span>{teacherName}</span> 👋
                </h1>
                <p className="welcome-subtitle">
                  Tienes <strong>{subjects.length}</strong> {subjects.length === 1 ? 'materia activa' : 'materias activas'} este ciclo.
                </p>
              </div>
              <span className="welcome-icon">🎓</span>
            </div>

            <div className="classes-preview-panel">
              {isLoading ? (
                <p className="empty-classes-message">Cargando clases...</p>
              ) : subjects.length === 0 ? (
                <p className="empty-classes-message">Aún no hay clases creadas.</p>
              ) : (
                <div className="classes-preview-list">
                  {subjects.map((subject) => {
                    const displayName = subject.nombre_class || subject.name || 'Sin nombre';
                    const displayDescription = subject.descrip_class || subject.description;
                    const displayColor = subject.color_class || subject.color || '#3b82f6';

                    return (
                      <div key={subject.id} className="class-preview-card">
                        {/* Colored banner */}
                        <div
                          className="card-color-banner"
                          onClick={() => handleSubjectClick(subject)}
                          style={{ backgroundColor: displayColor, cursor: 'pointer' }}
                        >
                          <h3>{displayName}</h3>
                          <div className="card-header">
                            <div className="card-menu">
                              <button
                                className="menu-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMenu(subject.id, e);
                                }}
                                aria-label="Opciones"
                              >
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </button>
                              {/*openMenuId === subject.id && (
                                <div className="menu-dropdown">
                                  <button
                                    className="menu-item"
                                    onClick={(e) => { e.stopPropagation(); handleAddStudent(subject); }}
                                  >
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    <span>Agregar Alumno</span>
                                  </button> 
                                  <button
                                    className="menu-item"
                                    onClick={(e) => { e.stopPropagation(); handleAddTask(subject); }}
                                  >
                                    <FontAwesomeIcon icon={faClipboardList} />
                                    <span>Agregar Tarea</span>
                                  </button>
                                  <button
                                    className="menu-item"
                                    onClick={(e) => { e.stopPropagation(); handleAddExamen(subject); }}
                                  >
                                    <FontAwesomeIcon icon={faFileAlt} />
                                    <span>Agregar Examen</span>
                                  </button>
                                  <button
                                    className="menu-item delete"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteClass(subject); }}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                    <span>Eliminar</span>
                                  </button>
                                </div>
                              )*/}
                            </div>
                          </div>
                        
                        </div>

                        {/* White card body */}
                        <div
                          className="card-body"
                          onClick={() => handleSubjectClick(subject)}
                          style={{ cursor: 'pointer' }}
                        >
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

                  {/* Add new subject card */}
                  <div
                    className="class-preview-card class-preview-card--add"
                    onClick={() => navigate('/teacher/clases')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate('/teacher/clases')}
                  >
                    <div className="add-icon">
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <span>Nueva materia</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-tools-label">Herramientas</div>
          <nav className="sidebar-nav">
            {/* Dropdown de Foros */}
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
                  <button className="user-menu-item" onClick={handleVerForos}>
                    <FontAwesomeIcon icon={faComments} />
                    <span>Ver Foros</span>
                  </button>
                  <button className="user-menu-item" onClick={handleCreateForo}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <span>Crear Foro</span>
                  </button>
                </div>
              )}
            </div>

            <button className="sidebar-btn" onClick={handleAvisos}>
              <FontAwesomeIcon icon={faClipboardList} />
              Avisos
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
                    <div className="dropdown-item empty">
                      No hay materias agregadas
                    </div>
                  ) : (
                    subjects.map((subject) => {
                      const displayName = subject.nombre_class || subject.name || 'Sin nombre';
                      return (
                        <button
                          key={subject.id}
                          className="dropdown-item"
                          onClick={() => handleSubjectClick(subject)}
                        >
                          {displayName}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </nav>
        </aside>

        {isMobileMenuOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

      </div>

      {/* Modal: Agregar Tarea */}
      {showAddTaskModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agregar Tarea — {selectedSubject?.nombre_class || selectedSubject?.name}</h2>
              <button className="close-button" onClick={closeModals}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={submitAddTask}>
              <div className="form-group">
                <label htmlFor="taskName">Título de la Tarea</label>
                <input
                  type="text"
                  id="taskName"
                  value={taskForm.titulo_tarea}
                  onChange={(e) => setTaskForm({...taskForm, titulo_tarea: e.target.value})}
                  placeholder="Ej: Tarea de Matemáticas"
                  required
                  disabled={isSubmittingTask}
                />
              </div>

              <div className="form-group">
                <label htmlFor="taskDescription">Descripción</label>
                <textarea
                  id="taskDescription"
                  value={taskForm.descrip_tarea}
                  onChange={(e) => setTaskForm({...taskForm, descrip_tarea: e.target.value})}
                  placeholder="Describe la tarea..."
                  rows={4}
                  disabled={isSubmittingTask}
                />
              </div>

              <div className="form-group">
                <label htmlFor="taskDeadline">Fecha Límite</label>
                <input
                  type="datetime-local"
                  id="taskDeadline"
                  value={taskForm.fecha_limite}
                  onChange={(e) => setTaskForm({...taskForm, fecha_limite: e.target.value})}
                  required
                  disabled={isSubmittingTask}
                />
              </div>

              <div className="form-group">
                <label htmlFor="taskPoints">Puntos Máximos</label>
                <input
                  type="number"
                  id="taskPoints"
                  min={1}
                  max={1000}
                  value={taskForm.puntos_max_tarea}
                  onChange={(e) => setTaskForm({...taskForm, puntos_max_tarea: e.target.value})}
                  required
                  disabled={isSubmittingTask}
                />
              </div>

              <div className="form-group form-group-inline">
                <input
                  type="checkbox"
                  id="taskLate"
                  checked={taskForm.entrega_tardia}
                  onChange={(e) => setTaskForm({...taskForm, entrega_tardia: e.target.checked})}
                  disabled={isSubmittingTask}
                />
                <label htmlFor="taskLate">Permitir entrega tardía</label>
              </div>

              {taskError && (
                <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '4px' }}>{taskError}</p>
              )}

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModals} disabled={isSubmittingTask}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={isSubmittingTask}>
                  {isSubmittingTask ? 'Guardando...' : 'Guardar Tarea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Portal: dropdown del menú de tarjeta — renderizado en body para evitar stacking context */}
      {openMenuId && createPortal(
        <>
          {/* Backdrop invisible — cierra el menú y bloquea todo lo de abajo */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
            onClick={() => setOpenMenuId(null)}
          />
          {/* Dropdown flotante */}
          <div
            className="menu-dropdown"
            style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
          >
            {subjects.filter(s => s.id === openMenuId).map(subject => (
              <React.Fragment key={subject.id}>
                {/*<button className="menu-item" onClick={() => handleAddStudent(subject)}>
                  <FontAwesomeIcon icon={faUserPlus} />
                  <span>Agregar Alumno</span>
                </button>*/}
                <button className="menu-item" onClick={() => handleAddTask(subject)}>
                  <FontAwesomeIcon icon={faClipboardList} />
                  <span>Agregar Tarea</span>
                </button>
                <button className="menu-item" onClick={() => handleAddExamen(subject)}>
                  <FontAwesomeIcon icon={faFileAlt} />
                  <span>Agregar Examen</span>
                </button>
                <button className="menu-item" onClick={() => handleAddEncuesta(subject)}>
                  <FontAwesomeIcon icon={faPollH} />
                  <span>Agregar Encuesta</span>
                </button>
                <button className="menu-item delete" onClick={() => handleDeleteClass(subject)}>
                  <FontAwesomeIcon icon={faTrash} />
                  <span>Eliminar</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </>,
        document.body
      )}

    </div>
  );
};

export default TeacherDashboard;


