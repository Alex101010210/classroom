import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUserPlus, faClipboardList, faTrash, faPlus, faFileAlt, faPollH, faEye, faBullhorn, faChartBar, faTimes } from '@fortawesome/free-solid-svg-icons';
import { classService, enrollmentService, encuestaService, examenService, taskService, StudentEnrollment, EncuestaDB, ExamenDB, TaskData } from '../../services/api';
import './ClassDetail.css';

interface ClassData {
  id: string;
  nombre_class: string;
  descrip_class?: string;
  color_class?: string;
}

interface TaskForm {
  titulo_tarea: string;
  descrip_tarea: string;
  fecha_limite: string;
  puntos_max_tarea: string;
  entrega_tardia: boolean;
}

const ClassDetail: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();

  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<StudentEnrollment[]>([]);
  const [tasks, setTasks]   = useState<TaskData[]>([]);
  const [exams, setExams]   = useState<ExamenDB[]>([]);
  const [polls, setPolls]   = useState<EncuestaDB[]>([]);

  const [emailInput, setEmailInput] = useState('');
  const [enrollError, setEnrollError] = useState('');
  const [enrollSuccess, setEnrollSuccess] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  // Modal agregar tarea
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [taskForm, setTaskForm] = useState<TaskForm>({
    titulo_tarea: '',
    descrip_tarea: '',
    fecha_limite: '',
    puntos_max_tarea: '100',
    entrega_tardia: false,
  });

  // Límites de fecha: hoy (sin pasado) y máximo 3 años
  const now = new Date();
  const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  const maxDate = new Date(now);
  maxDate.setFullYear(maxDate.getFullYear() + 3);
  const maxDateTime = new Date(maxDate.getTime() - maxDate.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  // Cargar datos de la clase
  const loadClass = useCallback(async () => {
    if (!classId) return;
    try {
      const response = await classService.getClassById(classId);
      setClassData(response.class);
    } catch {
      setPageError('No se pudo cargar la clase');
      navigate('/teacher/dashboard');
    }
  }, [classId, navigate]);

  // Cargar alumnos inscritos
  const loadStudents = useCallback(async () => {
    if (!classId) return;
    try {
      const list = await enrollmentService.getStudents(classId);
      setStudents(list);
    } catch {
      setStudents([]);
    }
  }, [classId]);

  // Cargar exámenes desde la API
  const loadExams = useCallback(async () => {
    if (!classId) return;
    try {
      const list = await examenService.getByClaseMaestro(classId);
      setExams(list);
    } catch {
      setExams([]);
    }
  }, [classId]);

  // Cargar encuestas desde la API
  const loadPolls = useCallback(async () => {
    if (!classId) return;
    try {
      const list = await encuestaService.getByClaseMaestro(classId);
      setPolls(list);
    } catch {
      setPolls([]);
    }
  }, [classId]);

  // Cargar tareas de la clase
  const loadTasks = useCallback(async () => {
    if (!classId) return;
    try {
      const list = await taskService.getTasksByClass(classId);
      setTasks(list);
    } catch {
      setTasks([]);
    }
  }, [classId]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([loadClass(), loadStudents(), loadExams(), loadPolls(), loadTasks()]);
      setIsLoading(false);
    };
    init();
  }, [loadClass, loadStudents, loadExams, loadPolls, loadTasks]);

  const handleBack = () => navigate('/teacher/dashboard');

  // Handlers de acción rápida
  const handleAddTask = () => setShowAddTaskModal(true);

  const handleAddExamen = () => {
    if (!classData) return;
    navigate('/teacher/examen', { state: { subject: classData } });
  };

  const handleAddEncuesta = () => {
    if (!classData) return;
    navigate('/teacher/encuestas', { state: { subject: classData } });
  };

  const submitAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId) return;
    setTaskError('');
    setIsSubmittingTask(true);
    try {
      const created = await taskService.createTask(classId, {
        titulo_tarea: taskForm.titulo_tarea.trim(),
        descrip_tarea: taskForm.descrip_tarea.trim() || undefined,
        fecha_limite: taskForm.fecha_limite,
        puntos_max_tarea: parseInt(taskForm.puntos_max_tarea, 10) || 100,
        entrega_tardia: taskForm.entrega_tardia,
      });
      setTasks(prev => [...prev, created]);
      setShowAddTaskModal(false);
      setTaskForm({ titulo_tarea: '', descrip_tarea: '', fecha_limite: '', puntos_max_tarea: '100', entrega_tardia: false });
    } catch (err: any) {
      setTaskError(err.response?.data?.message || 'Error al guardar la tarea');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const closeTaskModal = () => {
    setShowAddTaskModal(false);
    setTaskError('');
    setTaskForm({ titulo_tarea: '', descrip_tarea: '', fecha_limite: '', puntos_max_tarea: '100', entrega_tardia: false });
  };

  // Inscribir alumno por email
  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !emailInput.trim()) {
      setEnrollError('Ingresa el email del alumno');
      return;
    }

    try {
      setIsEnrolling(true);
      setEnrollError('');
      setEnrollSuccess('');

      const newStudent = await enrollmentService.enrollStudent(classId, emailInput.trim());
      setStudents(prev => [...prev, newStudent]);
      setEmailInput('');
      setEnrollSuccess(`${newStudent.nombre} ${newStudent.apellido} inscrito correctamente`);
      setTimeout(() => setEnrollSuccess(''), 3000);
    } catch (err: any) {
      setEnrollError(err.response?.data?.message || 'Error al inscribir al alumno');
    } finally {
      setIsEnrolling(false);
    }
  };

  // Dar de baja a un alumno
  const handleRemoveStudent = async (student: StudentEnrollment) => {
    if (!classId) return;
    if (!window.confirm(`¿Eliminar a ${student.nombre} ${student.apellido} de la clase?`)) return;

    try {
      await enrollmentService.removeStudent(classId, student.id);
      setStudents(prev => prev.filter(s => s.id !== student.id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar al alumno');
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId: number) => {
    if (!classId) return;
    if (!window.confirm('¿Está seguro que desea eliminar esta tarea?')) return;
    try {
      await taskService.deleteTask(classId, String(taskId));
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar la tarea');
    }
  };

  // Eliminar examen
  const handleDeleteExam = async (examId: number) => {
    if (!window.confirm('¿Está seguro que desea eliminar este examen?')) return;
    try {
      await examenService.delete(examId);
      setExams(prev => prev.filter(e => e.id !== examId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar el examen');
    }
  };

  // Eliminar encuesta
  const handleDeletePoll = async (pollId: number) => {
    if (!window.confirm('¿Está seguro que desea eliminar esta encuesta?')) return;
    try {
      await encuestaService.delete(pollId);
      setPolls(prev => prev.filter(p => p.id !== pollId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar la encuesta');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="class-detail-page">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  if (pageError || !classData) {
    return (
      <div className="class-detail-page">
        <div className="loading">{pageError || 'Clase no encontrada'}</div>
      </div>
    );
  }

  return (
    <div className="class-detail-page">
      <header className="app-header">
        <button className="app-header-back" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver</span>
        </button>
        <h1 className="app-header-title">{classData.nombre_class}</h1>
        <div className="app-header-actions">
          <button
            className="app-header-btn"
            onClick={() => navigate(`/teacher/avisos/${classId}`)}
          >
            <FontAwesomeIcon icon={faBullhorn} />
            Avisos
          </button>
        </div>
      </header>

      <div className="class-detail-content">

        {/* Información */}
        <section className="class-info-section">
          <div className="info-card">
            <h2>Información de la Clase</h2>
            <div className="info-item">
              <strong>Nombre:</strong>
              <p>{classData.nombre_class}</p>
            </div>
            {classData.descrip_class && (
              <div className="info-item">
                <strong>Descripción:</strong>
                <p>{classData.descrip_class}</p>
              </div>
            )}
            <div className="info-item">
              <strong>Total de alumnos:</strong>
              <p>{students.length}</p>
            </div>
            <div className="info-item">
              <strong>Total de tareas:</strong>
              <p>{tasks.length}</p>
            </div>
          </div>
        </section>

        {/* Inscribir alumno */}
        <section className="students-section">
          <div className="section-header">
            <h2>
              <FontAwesomeIcon icon={faUserPlus} />
              Alumnos Inscritos
            </h2>
          </div>

          <form className="enroll-form" onSubmit={handleEnrollStudent}>
            <div className="enroll-input-group">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Email del alumno para inscribir"
                disabled={isEnrolling}
              />
              <button type="submit" className="btn-primary" disabled={isEnrolling}>
                <FontAwesomeIcon icon={faPlus} />
                <span>{isEnrolling ? 'Inscribiendo...' : 'Inscribir'}</span>
              </button>
            </div>
            {enrollError && (
              <p className="error-message" style={{ color: 'red', marginTop: '6px', fontSize: '0.9rem' }}>
                {enrollError}
              </p>
            )}
            {enrollSuccess && (
              <p className="success-message" style={{ color: 'green', marginTop: '6px', fontSize: '0.9rem' }}>
                {enrollSuccess}
              </p>
            )}
          </form>

          {students.length === 0 ? (
            <div className="empty-state">
              <p>No hay alumnos inscritos en esta clase</p>
            </div>
          ) : (
            <div className="students-grid">
              {students.map((student) => (
                <div key={student.id} className="student-card">
                  <div className="student-info">
                    <span className="student-name">
                      {student.nombre} {student.apellido}
                    </span>
                    <span className="student-email" style={{ fontSize: '0.82rem', color: '#57606a' }}>
                      {student.email}
                    </span>
                    <span className="student-date" style={{ fontSize: '0.78rem', color: '#888' }}>
                      Inscrito: {formatDate(student.fechaInscripcion)}
                    </span>
                  </div>
                  <button
                    className="btn-delete-small"
                    onClick={() => handleRemoveStudent(student)}
                    title="Eliminar alumno"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Tareas Asignadas */}
        <section className="tasks-section">
          <div className="section-header">
            <h2>
              <FontAwesomeIcon icon={faClipboardList} />
              Tareas Asignadas
            </h2>
            <button className="btn-section-action" onClick={handleAddTask}>
              <FontAwesomeIcon icon={faPlus} />
              Agregar Tarea
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No hay tareas asignadas en esta clase</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3 className="task-title-link" title={task.titulo_tarea}>
                      {task.titulo_tarea}
                    </h3>
                    <div className="task-actions">
                      <button
                        className="btn-view-small"
                        onClick={() => navigate(`/teacher/class/${classId}/task/${task.id}`)}
                        title="Ver / Editar tarea"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="btn-delete-small"
                        onClick={() => handleDeleteTask(task.id)}
                        title="Eliminar tarea"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                  <div className="task-body">
                    {task.descrip_tarea && (
                      <p className="task-description">{task.descrip_tarea}</p>
                    )}
                    <div className="task-meta">
                      <span className="task-deadline">
                        <strong>Fecha límite:</strong> {formatDate(task.fecha_limite)}
                      </span>
                      <span className="task-points">
                        <strong>Puntos:</strong> {task.puntos_max_tarea}
                      </span>
                      {task.entrega_tardia && (
                        <span className="task-late-badge">Entrega tardía permitida</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Exámenes */}
        <section className="exams-section">
          <div className="section-header">
            <h2>
              <FontAwesomeIcon icon={faFileAlt} />
              Exámenes
            </h2>
            <button className="btn-section-action btn-section-action--exam" onClick={handleAddExamen}>
              <FontAwesomeIcon icon={faPlus} />
              Agregar Examen
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="empty-state">
              <p>No hay exámenes creados para esta clase</p>
            </div>
          ) : (
            <div className="tasks-list">
              {exams.map((exam) => {
                const totalPts = exam.preguntas?.reduce((s, p) => s + (p.points || 0), 0) ?? 0;
                return (
                  <div key={exam.id} className="task-card exam-card">
                    <div className="task-header">
                      <button
                        className="exam-card-title-row exam-card-title-btn"
                        onClick={() => navigate('/teacher/examen', { state: { subject: classData, exam } })}
                        title="Ver / editar examen"
                      >
                        <span className="exam-color-dot" style={{ backgroundColor: exam.color }} />
                        <h3>{exam.titulo}</h3>
                      </button>
                      <div className="exam-card-meta-right">
                        {exam.deadline && (
                          <span
                            className={`exam-deadline-badge${new Date(exam.deadline) < new Date() ? ' exam-deadline-badge--expired' : ''}`}
                            title="Fecha límite"
                          >
                            🕐 {new Date(exam.deadline).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        )}
                        {exam.one_attempt && (
                          <span className="exam-attempt-badge" title="Un intento por alumno">1 intento</span>
                        )}
                        <span className="exam-pts-badge">{totalPts} pts · {exam.preguntas?.length ?? 0} preguntas</span>
                        <button
                          className="btn-view-small"
                          onClick={() => navigate(`/teacher/examen/${exam.id}/resultados`)}
                          title="Ver respuestas"
                        >
                          <FontAwesomeIcon icon={faChartBar} />
                        </button>
                        <button
                          className="btn-delete-small"
                          onClick={() => handleDeleteExam(exam.id)}
                          title="Eliminar examen"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    {exam.descripcion && (
                      <div className="task-body">
                        <p className="task-description">{exam.descripcion}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Encuestas Asignadas */}
        <section className="tasks-section">
          <div className="section-header">
            <h2>
              <FontAwesomeIcon icon={faPollH} />
              Encuestas Asignadas
            </h2>
            <button className="btn-section-action btn-section-action--poll" onClick={handleAddEncuesta}>
              <FontAwesomeIcon icon={faPlus} />
              Agregar Encuesta
            </button>
          </div>

          {polls.length === 0 ? (
            <div className="empty-state">
              <p>No hay encuestas asignadas en esta clase</p>
            </div>
          ) : (
            <div className="tasks-list">
              {polls.map((poll) => (
                <div key={poll.id} className="task-card">
                  <div className="task-header">
                    <h3>{poll.titulo}</h3>
                    <div className="task-actions">
                      <button
                        className="btn-view-small"
                        onClick={() => navigate(`/teacher/encuesta/${poll.id}/resultados`)}
                        title="Ver respuestas"
                      >
                        <FontAwesomeIcon icon={faChartBar} />
                      </button>
                      <button
                        className="btn-delete-small"
                        onClick={() => handleDeletePoll(poll.id)}
                        title="Eliminar encuesta"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                  <div className="task-body">
                    {poll.descripcion && (
                      <p className="task-description">{poll.descripcion}</p>
                    )}
                    <div className="task-meta">
                      <span className="task-deadline">
                        <strong>Preguntas:</strong> {poll.preguntas.length}
                      </span>
                      <span className="task-deadline">
                        <strong>Creada:</strong> {new Date(poll.created_at).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal: Agregar Tarea */}
      {showAddTaskModal && (
        <div className="modal-overlay" onClick={closeTaskModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agregar Tarea — {classData?.nombre_class}</h2>
              <button className="close-button" onClick={closeTaskModal}>
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
                  onChange={(e) => setTaskForm({ ...taskForm, titulo_tarea: e.target.value })}
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
                  onChange={(e) => setTaskForm({ ...taskForm, descrip_tarea: e.target.value })}
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
                  onChange={(e) => setTaskForm({ ...taskForm, fecha_limite: e.target.value })}
                  min={minDateTime}
                  max={maxDateTime}
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
                  onChange={(e) => setTaskForm({ ...taskForm, puntos_max_tarea: e.target.value })}
                  required
                  disabled={isSubmittingTask}
                />
              </div>

              <div className="form-group form-group-inline">
                <input
                  type="checkbox"
                  id="taskLate"
                  checked={taskForm.entrega_tardia}
                  onChange={(e) => setTaskForm({ ...taskForm, entrega_tardia: e.target.checked })}
                  disabled={isSubmittingTask}
                />
                <label htmlFor="taskLate">Permitir entrega tardía</label>
              </div>

              {taskError && (
                <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '4px' }}>{taskError}</p>
              )}

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeTaskModal} disabled={isSubmittingTask}>
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
    </div>
  );
};

export default ClassDetail;

// Made with Bob
