import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/authService';
import '../teacher/Foro.css';

const StudentForo: React.FC = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentUser = authService.getCurrentUser();
  const studentName = currentUser
    ? `${currentUser.nombre} ${currentUser.apellido || ''}`.trim()
    : 'Estudiante';

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    objetivo: '',
    preguntaDetonadora: '',
    fechaInicio: '',
    fechaLimite: '',
    materialApoyo: null as File | null,
    enlace: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, materialApoyo: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newForo = {
      id: Date.now().toString(),
      ...formData,
      materialApoyo: formData.materialApoyo?.name || '',
      createdAt: new Date().toISOString()
    };

    const savedForos = localStorage.getItem('student_foros');
    const foros = savedForos ? JSON.parse(savedForos) : [];
    foros.push(newForo);
    localStorage.setItem('student_foros', JSON.stringify(foros));

    alert('¡Foro creado exitosamente!');
    navigate('/student/foros-list');
  };

  const handleBack = () => {
    navigate('/student/dashboard');
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="foro-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-logo">
          <button className="btn-back" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <span className="header-logo-text">PollClass</span>
        </div>
        <div className="header-actions">
          <div className="user-menu-container" ref={userMenuRef}>
            <button className="btn-header btn-users" onClick={() => setShowUserMenu(!showUserMenu)}>
              <FontAwesomeIcon icon={faUser} />
            </button>
            {showUserMenu && (
              <div className="user-dropdown-menu">
                <div className="user-menu-name">{studentName}</div>
                <button className="user-menu-item" onClick={() => { setShowUserMenu(false); navigate('/student/profile'); }}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Mi Perfil</span>
                </button>
                <button className="user-menu-item logout" onClick={() => { if (window.confirm('¿Estás seguro que deseas salir?')) { authService.logout(); navigate('/login'); } }}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="foro-container">
        <div className="foro-header">
          <h1>Foro Académico</h1>
        </div>

        <form className="foro-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">Título del foro:</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              placeholder="Ingresa el título del foro"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción / Instrucciones:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe el propósito del foro y las instrucciones para participar"
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="objetivo">Objetivo de aprendizaje:</label>
            <textarea
              id="objetivo"
              name="objetivo"
              value={formData.objetivo}
              onChange={handleInputChange}
              placeholder="¿Qué esperas que los participantes aprendan con este foro?"
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preguntaDetonadora">Pregunta detonadora:</label>
            <textarea
              id="preguntaDetonadora"
              name="preguntaDetonadora"
              value={formData.preguntaDetonadora}
              onChange={handleInputChange}
              placeholder="Plantea una pregunta que genere reflexión y discusión"
              rows={3}
              required
            />
          </div>

          <div className="form-group foro-type">
            <label>Tipo de foro:</label>
            <div className="foro-type-badge">
              <span className="badge-open">FORO ABIERTO</span>
              <p className="foro-type-description">
                Todos los participantes pueden ver y participar en las discusiones
              </p>
            </div>
          </div>

          <div className="form-group">
            <label>Material de apoyo (opcional):</label>
            <div className="material-apoyo-container">
              <div className="file-upload">
                <input
                  type="file"
                  id="materialApoyo"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                />
                <label htmlFor="materialApoyo" className="file-upload-label">
                  Subir archivo
                </label>
                {formData.materialApoyo && (
                  <span className="file-name">{formData.materialApoyo.name}</span>
                )}
              </div>
              <div className="enlace-input">
                <input
                  type="url"
                  name="enlace"
                  value={formData.enlace}
                  onChange={handleInputChange}
                  placeholder="Agregar enlace (URL)"
                />
              </div>
            </div>
          </div>

          <div className="form-group dates-container">
            <div className="date-field">
              <label htmlFor="fechaInicio">Fecha de inicio:</label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="date-field">
              <label htmlFor="fechaLimite">Fecha límite:</label>
              <input
                type="date"
                id="fechaLimite"
                name="fechaLimite"
                value={formData.fechaLimite}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/student/foros-list')}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Crear Foro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForo;
