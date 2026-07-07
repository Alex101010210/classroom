import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faPaperPlane, faCircle } from '@fortawesome/free-solid-svg-icons';
import { foroService, postForoService, PostForoData } from '../../services/api';
import { useForoSocket } from '../../hooks/useForoSocket';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  // Scroll automático al último mensaje
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [posts]);

  const handleSocketPost = useCallback((post: PostForoData) => {
    setPosts(prev => {
      const exists = prev.some(p => String(p.id) === String(post.id));
      return exists ? prev : [...prev, post];
    });
  }, []);

  const { connected } = useForoSocket({ foroId, onNewPost: handleSocketPost });

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim() || !foroId) return;

    try {
      setIsSubmitting(true);
      await postForoService.createPost(foroId, nuevoComentario.trim());
      // No agregar aquí: el socket emite el post a todos incluyendo al emisor
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
      <header className="app-header">
        <button className="app-header-back" onClick={() => navigate('/student/foros-list')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Foros</span>
        </button>
        <h1 className="app-header-title">
          {foro ? foro.titulo : 'Discusión'}
        </h1>
        <div className="app-header-actions">
          <span className={`socket-status ${connected ? 'socket-status--on' : 'socket-status--off'}`} title={connected ? 'En vivo' : 'Reconectando...'}>
            <FontAwesomeIcon icon={faCircle} />
            {connected ? 'En vivo' : 'Conectando...'}
          </span>
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
          <div className="comentarios-lista" ref={listRef}>
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
