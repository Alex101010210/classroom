import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUserPlus, faClipboardList, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ClassDetail.css';

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

const ClassDetail: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const location = useLocation();
  const [subject, setSubject] = useState<Subject | null>(null);
//Obtener datos de la clase
  useEffect(() => {
    
    if (location.state?.subject) {
      setSubject(location.state.subject);
    } else {
      
      const savedSubjects = localStorage.getItem('subjects');
      if (savedSubjects) {
        const subjects: Subject[] = JSON.parse(savedSubjects);
        const foundSubject = subjects.find(s => s.id === classId);
        if (foundSubject) {
          setSubject(foundSubject);
        } else {
          navigate('/teacher/dashboard');
        }
      } else {
        navigate('/teacher/dashboard');
      }
    }
  }, [classId, location.state, navigate]);

  const handleBack = () => {
    navigate('/teacher/dashboard');
  };
//Eliminar tarea
  const handleDeleteTask = (taskId: string) => {
    if (!subject) return;
    
    if (window.confirm('¿Está seguro que desea eliminar esta tarea?')) {
      const updatedTasks = (subject.tasks || []).filter(task => task.id !== taskId);
      const updatedSubject = { ...subject, tasks: updatedTasks };
      
      
      const savedSubjects = localStorage.getItem('subjects');
      if (savedSubjects) {
        const subjects: Subject[] = JSON.parse(savedSubjects);
        const updatedSubjects = subjects.map(s => 
          s.id === subject.id ? updatedSubject : s
        );
        localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
        setSubject(updatedSubject);
      }
    }
  };

  const handleDeleteStudent = (studentName: string) => {
    if (!subject) return;
    
    if (window.confirm(`¿Está seguro que desea eliminar a ${studentName}?`)) {
      const updatedStudents = (subject.students || []).filter(s => s !== studentName);
      const updatedSubject = { ...subject, students: updatedStudents };
      
      
      const savedSubjects = localStorage.getItem('subjects');
      if (savedSubjects) {
        const subjects: Subject[] = JSON.parse(savedSubjects);
        const updatedSubjects = subjects.map(s => 
          s.id === subject.id ? updatedSubject : s
        );
        localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
        setSubject(updatedSubject);
      }
    }
  };
//Fecha de entrega
  const formatDeadline = (deadline: string) => {
    if (!deadline) return 'Sin fecha límite';
    const date = new Date(deadline);
    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!subject) {
    return (
      <div className="class-detail-page">
        <div className="loading">Cargando...</div>
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
        <h1>{subject.name}</h1>
      </header>

      <div className="class-detail-content">
        {}
        <section className="class-info-section">
          <div className="info-card">
            <h2>Información de la Clase</h2>
            <div className="info-item">
              <strong>Nombre:</strong>
              <p>{subject.name}</p>
            </div>
            {subject.description && (
              <div className="info-item">
                <strong>Descripción:</strong>
                <p>{subject.description}</p>
              </div>
            )}
            <div className="info-item">
              <strong>Total de alumnos:</strong>
              <p>{subject.students?.length || 0}</p>
            </div>
            <div className="info-item">
              <strong>Total de tareas:</strong>
              <p>{subject.tasks?.length || 0}</p>
            </div>
          </div>
        </section>

        {}
        <section className="students-section">
          <div className="section-header">
            <h2>
              <FontAwesomeIcon icon={faUserPlus} />
              Alumnos Inscritos
            </h2>
          </div>
          
          {!subject.students || subject.students.length === 0 ? (
            <div className="empty-state">
              <p>No hay alumnos inscritos en esta clase</p>
            </div>
          ) : (
            <div className="students-grid">
              {subject.students.map((student, index) => (
                <div key={index} className="student-card">
                  <div className="student-info">
                    <span className="student-number">{index + 1}</span>
                    <span className="student-name">{student}</span>
                  </div>
                  <button
                    className="btn-delete-small"
                    onClick={() => handleDeleteStudent(student)}
                    title="Eliminar alumno"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {}
        <section className="tasks-section">
          <div className="section-header">
            <h2>
              <FontAwesomeIcon icon={faClipboardList} />
              Tareas Asignadas
            </h2>
          </div>
          
          {!subject.tasks || subject.tasks.length === 0 ? (
            <div className="empty-state">
              <p>No hay tareas asignadas en esta clase</p>
            </div>
          ) : (
            <div className="tasks-list">
              {subject.tasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3>{task.name}</h3>
                    <button
                      className="btn-delete-small"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Eliminar tarea"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <div className="task-body">
                    <p className="task-description">{task.description}</p>
                    <div className="task-meta">
                      <span className="task-deadline">
                        <strong>Fecha límite:</strong> {formatDeadline(task.deadline)}
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

