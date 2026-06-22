import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import './Clases.css';

interface Subject {
  id: string;
  name: string;
  description?: string;
  students?: string[];
  createdAt: string;
}
const getStudentCount = (subject: Subject):
number => {
  return subject.students?.length || 0;
};

const Clases: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [studentsInput, setStudentsInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();

    if (!className.trim()) {
      return;
    }

    const students = studentsInput
      .split(',')
      .map((student) => student.trim())
      .filter(Boolean);

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: className.trim(),
      description: classDescription.trim(),
      students,
      createdAt: new Date().toISOString()
    };

    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
    setSuccessMessage('Clase creada correctamente');
    setClassName('');
    setClassDescription('');
    setStudentsInput('');

    navigate('/teacher/dashboard');
  };

  const handleBack = () => {
    navigate('/teacher/dashboard');
  };

  const handleClassClick = (subject: Subject) => {
    navigate(`/teacher/class/${subject.id}`, { state: { subject } });
  };

  return (
    <div className="clases-page">
      <header className="clases-header">
        <button className="btn-back" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver</span>
        </button>
        <h1>Gestión de Materias</h1>
      </header>

      <div className="clases-content">
        <section className="create-class-panel">
          <h2>Crear nueva clase</h2>
          <form className="class-form" onSubmit={handleCreateClass}>
            <div className="form-group">
              <label htmlFor="className">Nombre de la nueva clase</label>
              <input
                id="className"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ej: Matemáticas 1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="classDescription">Descripción de la clase</label>
              <textarea
                id="classDescription"
                value={classDescription}
                onChange={(e) => setClassDescription(e.target.value)}
                placeholder="Describe la clase..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentsInput">Agregar alumnos</label>
              <input
                id="studentsInput"
                type="text"
                value={studentsInput}
                onChange={(e) => setStudentsInput(e.target.value)}
                placeholder="Juan, Ana, Luis"
              />
            </div>

            <button type="submit" className="btn-primary btn-create-class">
              <FontAwesomeIcon icon={faPlus} />
              <span>Crear</span>
            </button>
          </form>

          {successMessage && <p className="success-message">{successMessage}</p>}
        </section>

        <section className="subjects-section">
          {subjects.length === 0 ? (
            <div className="empty-state">
              <p>No hay materias registradas</p>
            </div>
          ) : (
            <div className="subjects-grid">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  className="subject-card"
                  onClick={() => handleClassClick(subject)}
                >
                  <div className="subject-header">
                    <h3>{subject.name}</h3>
                  </div>
                  {subject.description && (
                    <p className="subject-description">{subject.description}</p>
                  )}
                  <div className="subject-info">
                    <p className="total-students">
                      <strong>Total de alumnos:</strong> {getStudentCount(subject)}
                    </p>
                    {subject.students && subject.students.length > 0 && (
                      <p className="subject-students">
                        Alumnos: {subject.students.join(', ')}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Clases;

// Made with Bob