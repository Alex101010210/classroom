import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faPlus, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Discusiones.css';

interface Foro {
  id: string;
  titulo: string;
  preguntaDetonadora: string;
}

interface Comentario {
  id: string;
  foroId: string;
  autor: string;
  texto: string;
  fecha: string;
}

const Discusiones: React.FC = () => {
  const navigate = useNavigate();
  const { foroId } = useParams<{ foroId: string }>();
  const [foro, setForo] = useState<Foro | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const savedForos = localStorage.getItem('foros');
    if (savedForos) {
      const foros: Foro[] = JSON.parse(savedForos);
      const found = foros.find(f => f.id === foroId);
      if (found) setForo(found);
    }

    const savedComentarios = localStorage.getItem('comentarios');
    if (savedComentarios) {
      const todos: Comentario[] = JSON.parse(savedComentarios);
      setComentarios(todos.filter(c => c.foroId === foroId));
    }
  }, [foroId]);

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    const nuevo: Comentario = {
      id: Date.now().toString(),
      foroId: foroId!,
      autor: 'Maestro',
      texto: nuevoComentario.trim(),
      fecha: new Date().toISOString(),
    };

    const savedComentarios = localStorage.getItem('comentarios');
    const todos: Comentario[] = savedComentarios ? JSON.parse(savedComentarios) : [];
    todos.push(nuevo);
    localStorage.setItem('comentarios', JSON.stringify(todos));

    setComentarios(prev => [...prev, nuevo]);
    setNuevoComentario('');
  };

  const handleEliminar = (comentarioId: string) => {
    const savedComentarios = localStorage.getItem('comentarios');
    if (!savedComentarios) return;
    const todos: Comentario[] = JSON.parse(savedComentarios);
    const actualizados = todos.filter(c => c.id !== comentarioId);
    localStorage.setItem('comentarios', JSON.stringify(actualizados));
    setComentarios(prev => prev.filter(c => c.id !== comentarioId));
  };

  const formatFecha = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="discusiones-page">
      <header className="dashboard-header">
        <div className="header-logo">
          <button className="btn-back" onClick={() => navigate('/teacher/foros-list')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
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

      <div className="discusiones-container">
        {foro && (
          <div className="discusiones-header">
            <h1>{foro.titulo}</h1>
            <p className="pregunta-detonadora">"{foro.preguntaDetonadora}"</p>
          </div>
        )}

        <div className="comentarios-lista">
          {comentarios.length === 0 ? (
            <div className="empty-discusiones">
              <p>Aún no hay participaciones. ¡Sé el primero en comentar!</p>
            </div>
          ) : (
            comentarios.map(c => (
              <div key={c.id} className="comentario-card">
                <div className="comentario-header">
                  <span className="comentario-autor">{c.autor}</span>
                  <div className="comentario-meta">
                    <span className="comentario-fecha">{formatFecha(c.fecha)}</span>
                    <button className="btn-eliminar-comentario" onClick={() => handleEliminar(c.id)} title="Eliminar">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
                <p className="comentario-texto">{c.texto}</p>
              </div>
            ))
          )}
        </div>

        <form className="comentario-form" onSubmit={handleEnviar}>
          <textarea
            value={nuevoComentario}
            onChange={e => setNuevoComentario(e.target.value)}
            placeholder="Escribe tu participación..."
            rows={3}
            required
          />
          <button type="submit" className="btn-enviar">
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Discusiones;
