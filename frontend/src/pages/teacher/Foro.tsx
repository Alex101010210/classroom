import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import './Foro.css';

const Foro: React.FC = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        materialApoyo: e.target.files![0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crear nuevo foro con ID único
    const newForo = {
      id: Date.now().toString(),
      ...formData,
      materialApoyo: formData.materialApoyo?.name || '',
      createdAt: new Date().toISOString()
    };

    // Obtener foros existentes del localStorage
    const savedForos = localStorage.getItem('foros');
    const foros = savedForos ? JSON.parse(savedForos) : [];
    
    // Agregar el nuevo foro
    foros.push(newForo);
    
    // Guardar en localStorage
    localStorage.setItem('foros', JSON.stringify(foros));
    
    // Mostrar mensaje de éxito
    alert('¡Foro creado exitosamente!');
    
    // Redirigir a la lista de foros
    navigate('/teacher/foros-list');
  };
  const handleForos = () => {
    navigate('/teacher/foros-list');
  }

  const handleBack = () => {
    navigate('/teacher/dashboard');
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
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="foro-page">
      {/* Header - Mismo que Dashboard */}
      <header className="dashboard-header">
        <div className="header-logo">
          <button className="btn-back" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
        <div className="header-actions">
          <button className="btn-header btn-add" onClick={handleBack}>
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
                  <FontAwesomeIcon icon={faArrowLeft} />
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
        {/* Título del foro */}
        <div className="form-group">
          <label htmlFor="titulo">
            <span className="icon"></span>
            Título del foro:
          </label>
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

        {/* Descripción / Instrucciones */}
        <div className="form-group">
          <label htmlFor="descripcion">
            <span className="icon"></span>
            Descripción / Instrucciones:
          </label>
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

        {/* Objetivo de aprendizaje */}
        <div className="form-group">
          <label htmlFor="objetivo">
            <span className="icon"></span>
            Objetivo de aprendizaje:
          </label>
          <textarea
            id="objetivo"
            name="objetivo"
            value={formData.objetivo}
            onChange={handleInputChange}
            placeholder="¿Qué esperas que los estudiantes aprendan con este foro?"
            rows={3}
            required
          />
        </div>

        {/* Pregunta detonadora */}
        <div className="form-group">
          <label htmlFor="preguntaDetonadora">
            <span className="icon"></span>
            Pregunta detonadora:
          </label>
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

        {/* Tipo de foro */}
        <div className="form-group foro-type">
          <label>
            <span className="icon"></span>
            Tipo de foro:
          </label>
          <div className="foro-type-badge">
            <span className="badge-open">FORO ABIERTO</span>
            <p className="foro-type-description">
              Todos los estudiantes pueden ver y participar en las discusiones
            </p>
          </div>
        </div>

        {/* Material de apoyo */}
        <div className="form-group">
          <label>
            <span className="icon"></span>
            Material de apoyo (opcional):
          </label>
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

        {/* Fechas */}
        <div className="form-group dates-container">
          <div className="date-field">
            <label htmlFor="fechaInicio">
              <span className="icon"></span>
              Fecha de inicio:
            </label>
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
            <label htmlFor="fechaLimite">
              <span className="icon"></span>
              Fecha límite:
            </label>
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

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleForos}>
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

export default Foro;


