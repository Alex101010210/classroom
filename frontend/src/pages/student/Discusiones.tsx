import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faPaperPlane, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { foroService, postForoService, PostForoData } from '../../services/api';
import { authService } from '../../services/authService';
import '../teacher/Discusiones.css';

interface Foro {
  id: number;
  titulo: string;
  pregunta: string;
}

const StudentDiscusiones: React.FC = () => {
  const navigate = useNavigate();
  const { foroId } = useParams<{ foroId: string }>();
  const [foro, setForo] = useState<Foro | null>(null);
  const [posts, setPosts] = useState<PostForoData[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentUser = authService.getCurrentUser();
  const studentName = currentUser
    ? `${currentUser.nombre} ${currentUser.apellido || ''}`.trim()
    : 'Estudiante';

  useEffect(() => {
    if (!foroId) return;

    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [foroData, postsData] = await Promise.all([
          foroService.getForoById(foroId),
          postForoService.getPosts(foroId),
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

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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

  const formatFecha = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="discusiones-page">
      <header className="dashboard-header">
        <div className="header-logo">
          <button className="btn-back" onClick={() => navigate('/student/foros-list')}>
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

export default StudentDiscusiones;
