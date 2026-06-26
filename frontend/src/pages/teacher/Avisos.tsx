import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faPlus, faTrash, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import './Avisos.css';

interface Aviso {
  id: string;
  fecha: string;
  mensaje: string;
  nombreMaestro: string;
  creadoEn: string;
}

const Avisos: React.FC = () => {
  const navigate = useNavigate();
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [formData, setFormData] = useState({
    fecha: '',
    mensaje: '',
    nombreMaestro: '',
  });

  useEffect(() => {
    const savedAvisos = localStorage.getItem('avisos');
    if (savedAvisos) {
      setAvisos(JSON.parse(savedAvisos));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Aviso = {
      id: Date.now().toString(),
      ...formData,
      creadoEn: new Date().toISOString(),
    };
    const actualizados = [...avisos, nuevo];
    setAvisos(actualizados);
    localStorage.setItem('avisos', JSON.stringify(actualizados));
    setFormData({ fecha: '', mensaje: '', nombreMaestro: '' });
  };

  const handleEliminar = (id: string) => {
    if (!window.confirm('¿Eliminar este aviso?')) return;
    const actualizados = avisos.filter(a => a.id !== id);
    setAvisos(actualizados);
    localStorage.setItem('avisos', JSON.stringify(actualizados));
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
          <button className="btn-back" onClick={() => navigate('/teacher/dashboard')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1>Logo</h1>
        </div>
        <div className="header-actions">
          <button className="btn-header btn-add" onClick={() => navigate('/teacher/foro')}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <div className="user-menu-container">
            <button className="btn-header btn-users" onClick={() => setShowUserMenu(!showUserMenu)}>
              <FontAwesomeIcon icon={faUser} />
            </button>
            {showUserMenu && (
              <div className="user-dropdown-menu">
                <button className="user-menu-item" onClick={() => { setShowUserMenu(false); alert('Perfil - por implementar'); }}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Mi Perfil</span>
                </button>
                <button className="user-menu-item logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="avisos-container">
        <div className="avisos-page-header">
          <FontAwesomeIcon icon={faBullhorn} />
          <h1>Avisos</h1>
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
              />
            </div>

            <div className="form-row atentamente-row">
              <label htmlFor="nombreMaestro">Atentamente:</label>
              <input
                type="text"
                id="nombreMaestro"
                name="nombreMaestro"
                value={formData.nombreMaestro}
                onChange={handleChange}
                placeholder="Nombre del maestro"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => setFormData({ fecha: '', mensaje: '', nombreMaestro: '' })}>
                Limpiar
              </button>
              <button type="submit" className="btn-submit">
                Publicar Aviso
              </button>
            </div>
          </form>
        </div>

        {/* Lista de avisos publicados */}
        {avisos.length > 0 && (
          <div className="avisos-publicados">
            <h2>Avisos publicados</h2>
            <div className="avisos-lista">
              {[...avisos].reverse().map(aviso => (
                <div key={aviso.id} className="aviso-card">
                  <div className="aviso-card-top">
                    <span className="aviso-tag">📢 Aviso</span>
                    <button className="btn-eliminar-aviso" onClick={() => handleEliminar(aviso.id)} title="Eliminar aviso">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <p className="aviso-fecha"><strong>Fecha:</strong> {formatFecha(aviso.fecha)}</p>
                  <p className="aviso-mensaje">{aviso.mensaje}</p>
                  <p className="aviso-atentamente"><em>Atentamente: {aviso.nombreMaestro}</em></p>
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
