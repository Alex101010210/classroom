import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUserPlus, faClipboardList, faTrash, faPlus, faFileAlt, faPollH, faEye } from '@fortawesome/free-solid-svg-icons';
import { classService, enrollmentService, encuestaService, examenService, taskService, StudentEnrollment, EncuestaDB, ExamenDB, TaskData } from '../../services/api';
import './ClassDetail.css';

interface ClassData {
  id: string;
  nombre_class: string;
  descrip_class?: string;
  color_class?: string;
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
      <header className="class-detail-header">
        <button className="btn-back" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver al Dashboard</span>
        </button>
        <h1 className="titulo-header">{classData.nombre_class}</h1>
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
                          <span className="exam-deadline-badge" title="Fecha límite">
                            🕐 {new Date(exam.deadline).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        )}
                        {exam.one_attempt && (
                          <span className="exam-attempt-badge" title="Un intento por alumno">1 intento</span>
                        )}
                        <span className="exam-pts-badge">{totalPts} pts · {exam.preguntas?.length ?? 0} preguntas</span>
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
                    <button
                      className="btn-delete-small"
                      onClick={() => handleDeletePoll(poll.id)}
                      title="Eliminar encuesta"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
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
                        <strong>Creada:</strong> {new Date(poll.creado_en).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ClassDetail;

// Made with Bob
