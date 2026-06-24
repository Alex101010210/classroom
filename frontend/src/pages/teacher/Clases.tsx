import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { classService } from '../../services/api';
import './Clases.css';

interface Subject {
  id: string;
  nombre_class?: string;
  name?: string;
  descrip_class?: string;
  description?: string;
  color_class?: string;
  color?: string;
  students?: string[];
  createdAt?: string;
  created_at?: string;
}

const getStudentCount = (subject: Subject): number => {
  return subject.students?.length || 0;
};

const Clases: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [classColor, setClassColor] = useState('#3b82f6');
  const [studentsInput, setStudentsInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar clases al montar el componente
  useEffect(() => {
    loadClasses();
  }, []);

  // Función para cargar clases desde la API
  const loadClasses = async () => {
    try {
      setIsLoading(true);
      const response = await classService.getTeacherClasses();
      setSubjects(response.classes || []);
      setErrorMessage('');
    } catch (error: any) {
      console.error('Error al cargar clases:', error);
      setErrorMessage('Error al cargar las clases');
      // Fallback a localStorage si falla la API
      const savedSubjects = localStorage.getItem('subjects');
      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!className.trim()) {
      setErrorMessage('El nombre de la clase es requerido');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // Crear clase en la base de datos
      await classService.createClass({
        nombre_class: className.trim(),
        descrip_class: classDescription.trim() || undefined,
        color_class: classColor,
      });

      setSuccessMessage('Clase creada correctamente');
      
      // Limpiar formulario
      setClassName('');
      setClassDescription('');
      setClassColor('#3b82f6');
      setStudentsInput('');

      // Recargar las clases
      await loadClasses();

      // Navegar al dashboard después de un breve delay
      setTimeout(() => {
        navigate('/teacher/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Error al crear clase:', error);
      setErrorMessage(error.response?.data?.message || 'Error al crear la clase');
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
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
              <label htmlFor="classColor">Color de la clase</label>
              <input
                id="classColor"
                type="color"
                value={classColor}
                onChange={(e) => setClassColor(e.target.value)}
                style={{ width: '100%', height: '40px', cursor: 'pointer' }}
              />
              <small style={{ color: '#666', fontSize: '0.85rem' }}>
                Selecciona un color para identificar la clase
              </small>
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

            <button type="submit" className="btn-primary btn-create-class" disabled={isLoading}>
              <FontAwesomeIcon icon={faPlus} />
              <span>{isLoading ? 'Creando...' : 'Crear'}</span>
            </button>
          </form>

          {successMessage && (
            <p className="success-message" style={{ color: 'green', marginTop: '10px' }}>
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>
              {errorMessage}
            </p>
          )}
        </section>

        <section className="subjects-section">
          {isLoading ? (
            <div className="empty-state">
              <p>Cargando clases...</p>
            </div>
          ) : subjects.length === 0 ? (
            <div className="empty-state">
              <p>No hay materias registradas</p>
            </div>
          ) : (
            <div className="subjects-grid">
              {subjects.map((subject) => {
                const displayName = subject.nombre_class || subject.name || 'Sin nombre';
                const displayDescription = subject.descrip_class || subject.description;
                const displayColor = subject.color_class || subject.color || '#3b82f6';
                
                return (
                  <button
                    key={subject.id}
                    type="button"
                    className="subject-card"
                    onClick={() => handleClassClick(subject)}
                    style={{
                      borderLeft: `4px solid ${displayColor}`
                    }}
                  >
                    <div className="subject-header">
                      <h3>{displayName}</h3>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: displayColor,
                          border: '2px solid #fff',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>
                    {displayDescription && (
                      <p className="subject-description">{displayDescription}</p>
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
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Clases;

// Made with Bob