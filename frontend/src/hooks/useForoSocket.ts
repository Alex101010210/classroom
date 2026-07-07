import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { PostForoData } from '../services/api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

interface UseForoSocketOptions {
  foroId: string | undefined;
  onNewPost: (post: PostForoData) => void;
}

/**
 * Conecta a Socket.IO, se une a la sala `forum-{foroId}` y llama
 * onNewPost cada vez que llega un evento `forum:new-post`.
 * Devuelve `connected` para mostrar indicador en UI.
 */
export function useForoSocket({ foroId, onNewPost }: UseForoSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!foroId) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-forum', foroId);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('forum:new-post', (post: PostForoData) => {
      onNewPost(post);
    });

    return () => {
      socket.emit('leave-forum', foroId);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
    // onNewPost se memoriza con useCallback en el componente consumidor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foroId]);

  return { connected };
}
