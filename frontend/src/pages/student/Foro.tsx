import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import { foroService } from '../../services/api';
import '../teacher/Foro.css';

const StudentForo: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await foroService.createForo({
        titulo: formData.titulo,
        descrip_foro: formData.descripcion || undefined,
        fecha_inicio: formData.fechaInicio,
        obejtivo_foro: formData.objetivo,
        pregunta: formData.preguntaDetonadora,
        fecha_fin: formData.fechaLimite,
        links: formData.enlace || undefined
      });
      alert('¡Foro creado exitosamente!');
      navigate('/student/foros-list');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al crear el foro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="foro-page">
      {/* Header */}
      <header className="app-header">
        <button className="app-header-back" onClick={() => navigate('/student/dashboard')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver</span>
        </button>
        <h1 className="app-header-title">Foro Académico</h1>
        <div className="app-header-actions">
          <button
            className="app-header-icon-btn"
            onClick={() => navigate('/student/profile')}
            aria-label="Mi Perfil"
            title="Mi Perfil"
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="foro-container">
        <div className="foro-header">
          <h1>Crear Foro</h1>
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
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Foro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForo;
