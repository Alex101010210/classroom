import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faPlus, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import { foroService, postForoService, PostForoData } from '../../services/api';
import './Discusiones.css';

interface Foro {
  id: number;
  titulo: string;
  pregunta: string;
}

const Discusiones: React.FC = () => {
  const navigate = useNavigate();
  const { foroId } = useParams<{ foroId: string }>();
  const [foro, setForo] = useState<Foro | null>(null);
  const [posts, setPosts] = useState<PostForoData[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!foroId) return;

    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [foroData, postsData] = await Promise.all([
          foroService.getForoById(foroId),
          postForoService.getPosts(foroId)
        ]);
        setForo({ id: foroData.id, titulo: foroData.titulo, pregunta: foroData.pregunta });
        setPosts(postsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el foro');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [foroId]);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim() || !foroId) return;

    try {
      setIsSubmitting(true);
      const newPost = await postForoService.createPost(foroId, nuevoComentario.trim());
      setPosts(prev => [...prev, newPost]);
      setNuevoComentario('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al enviar el comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminar = async (postId: number) => {
    if (!foroId) return;
    try {
      await postForoService.deletePost(foroId, postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar el comentario');
    }
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
        {loading && (
          <div className="empty-discusiones">
            <p>Cargando...</p>
          </div>
        )}

        {error && (
          <div className="empty-discusiones">
            <p style={{ color: '#ef4444' }}>{error}</p>
          </div>
        )}

        {!loading && !error && foro && (
          <div className="discusiones-header">
            <h1>{foro.titulo}</h1>
            <p className="pregunta-detonadora">"{foro.pregunta}"</p>
          </div>
        )}

        {!loading && !error && (
          <div className="comentarios-lista">
            {posts.length === 0 ? (
              <div className="empty-discusiones">
                <p>Aún no hay participaciones. ¡Sé el primero en comentar!</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="comentario-card">
                  <div className="comentario-header">
                    <span className="comentario-autor">
                      {post.autor.nombre} {post.autor.apellido}
                    </span>
                    <div className="comentario-meta">
                      <span className="comentario-fecha">{formatFecha(post.fecha_publicacion)}</span>
                      <button
                        className="btn-eliminar-comentario"
                        onClick={() => handleEliminar(post.id)}
                        title="Eliminar"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                  <p className="comentario-texto">{post.contenido}</p>
                </div>
              ))
            )}
          </div>
        )}

        {!loading && !error && (
          <form className="comentario-form" onSubmit={handleEnviar}>
            <textarea
              value={nuevoComentario}
              onChange={e => setNuevoComentario(e.target.value)}
              placeholder="Escribe tu participación..."
              rows={3}
              required
            />
            <button type="submit" className="btn-enviar" disabled={isSubmitting}>
              <FontAwesomeIcon icon={faPaperPlane} />
              <span>{isSubmitting ? 'Enviando...' : 'Enviar'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Discusiones;

// Made with Bob
