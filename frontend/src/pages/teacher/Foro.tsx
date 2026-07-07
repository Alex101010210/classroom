import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { foroService } from '../../services/api';
import './Foro.css';

const Foro: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    objetivo: '',
    preguntaDetonadora: '',
    fechaInicio: '',
    fechaLimite: '',
    enlace: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Límites de fecha: hoy (sin pasado) y máximo 3 años hacia adelante — solo fecha (YYYY-MM-DD)
  const now = new Date();
  const minDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10); // "YYYY-MM-DD"
  const maxDateObj = new Date(now);
  maxDateObj.setFullYear(maxDateObj.getFullYear() + 3);
  const maxDate = new Date(maxDateObj.getTime() - maxDateObj.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);


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
      navigate('/teacher/foros-list');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al crear el foro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => navigate('/teacher/foros-list');


  return (
    <div className="foro-page">
      <header className="app-header">
        <button className="app-header-back" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver</span>
        </button>
        <h1 className="app-header-title">Crear Foro Académico</h1>
      </header>

      <div className="foro-container">
        <div className="foro-header">
          <h1>Foro Académico</h1>
        </div>

        <form className="foro-form" onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>
              <span className="icon"></span>
              Material de apoyo (opcional):
            </label>
            <div className="material-apoyo-container">
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
                min={minDate}
                max={maxDate}
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
                min={minDate}
                max={maxDate}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleBack}>
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

export default Foro;
