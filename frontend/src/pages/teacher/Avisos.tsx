import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { avisoService, AvisoData } from '../../services/api';
import { authService } from '../../services/authService';
import './Avisos.css';

const Avisos: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();

  const [avisos, setAvisos] = useState<AvisoData[]>([]);
  const [className, setClassName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ fecha: '', mensaje: '', nombre_maestro: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Pre-llenar el nombre del maestro con el usuario actual
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setFormData(prev => ({
        ...prev,
        nombre_maestro: `${user.nombre} ${user.apellido || ''}`.trim()
      }));
    }

    // Nombre de la clase desde localStorage
    const teacherClasses: any[] = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const found = teacherClasses.find((c: any) => String(c.id) === String(classId));
    if (found) setClassName(found.nombre_class || found.name || '');
  }, [classId]);

  useEffect(() => {
    if (!classId) return;
    avisoService.getByClase(classId)
      .then(setAvisos)
      .catch(() => setAvisos([]))
      .finally(() => setIsLoading(false));
  }, [classId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId) return;
    setIsSubmitting(true);
    setError('');
    try {
      const nuevo = await avisoService.create(classId, formData);
      setAvisos(prev => [nuevo, ...prev]);
      setFormData(prev => ({ ...prev, fecha: '', mensaje: '' }));
    } catch {
      setError('Error al publicar el aviso. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!classId || !window.confirm('¿Eliminar este aviso?')) return;
    try {
      await avisoService.delete(classId, id);
      setAvisos(prev => prev.filter(a => a.id !== id));
    } catch {
      alert('Error al eliminar el aviso.');
    }
  };

  const formatFecha = (dateString: string) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="avisos-page">
      <header className="dashboard-header">
        <div className="header-logo">
          <button className="btn-back" onClick={() => navigate(`/teacher/class/${classId}`)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1>{className ? `Avisos — ${className}` : 'Avisos'}</h1>
        </div>
      </header>

      <div className="avisos-container">
        <div className="avisos-page-header">
          <FontAwesomeIcon icon={faBullhorn} />
          <h1>Avisos{className ? ` — ${className}` : ''}</h1>
        </div>

        {/* Formulario para crear aviso */}
        <div className="aviso-form-card">
          <form className="aviso-form" onSubmit={handleSubmit}>
            <div className="aviso-preview-label">
              <FontAwesomeIcon icon={faBullhorn} />
              <span>📢 Aviso</span>
            </div>

            <div className="form-row">
              <label htmlFor="fecha">Fecha:</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-row">
              <label htmlFor="mensaje">Mensaje:</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Escribe el mensaje del aviso..."
                rows={5}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-row atentamente-row">
              <label htmlFor="nombre_maestro">Atentamente:</label>
              <input
                type="text"
                id="nombre_maestro"
                name="nombre_maestro"
                value={formData.nombre_maestro}
                onChange={handleChange}
                placeholder="Nombre del maestro"
                required
                disabled={isSubmitting}
              />
            </div>

            {error && <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '4px' }}>{error}</p>}

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setFormData(prev => ({ ...prev, fecha: '', mensaje: '' }))}
                disabled={isSubmitting}
              >
                Limpiar
              </button>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Publicando...' : 'Publicar Aviso'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de avisos publicados */}
        {isLoading ? (
          <p style={{ textAlign: 'center', color: '#57606a', marginTop: '24px' }}>Cargando avisos...</p>
        ) : avisos.length > 0 && (
          <div className="avisos-publicados">
            <h2>Avisos publicados</h2>
            <div className="avisos-lista">
              {avisos.map(aviso => (
                <div key={aviso.id} className="aviso-card">
                  <div className="aviso-card-top">
                    <span className="aviso-tag">📢 Aviso</span>
                    <button
                      className="btn-eliminar-aviso"
                      onClick={() => handleEliminar(aviso.id)}
                      title="Eliminar aviso"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <p className="aviso-fecha"><strong>Fecha:</strong> {formatFecha(aviso.fecha)}</p>
                  <p className="aviso-mensaje">{aviso.mensaje}</p>
                  <p className="aviso-atentamente"><em>Atentamente: {aviso.nombre_maestro}</em></p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Avisos;
