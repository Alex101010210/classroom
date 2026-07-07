import { useEffect, useRef } from 'react';
import { useSocketContext } from '../context/SocketContext';

/**
 * Joins an encuesta results room and listens for new responses in real time.
 *
 * @param encuestaId  The encuesta to subscribe to (pass null/undefined to skip)
 * @param onNuevaRespuesta  Callback invoked with the new response payload
 */
export function useEncuestaSocket(
  encuestaId: string | number | null | undefined,
  onNuevaRespuesta: (payload: any) => void
) {
  const { socket } = useSocketContext();
  const callbackRef = useRef(onNuevaRespuesta);
  callbackRef.current = onNuevaRespuesta;

  useEffect(() => {
    if (!socket || !encuestaId) return;

    socket.emit('join-encuesta', encuestaId);

    const handler = (payload: any) => callbackRef.current(payload);
    socket.on('nueva-respuesta', handler);

    return () => {
      socket.off('nueva-respuesta', handler);
      socket.emit('leave-encuesta', encuestaId);
    };
  }, [socket, encuestaId]);
}

/**
 * Joins a poll room and returns a subscribe helper.
 */
export function usePollSocket(
  pollId: string | null | undefined,
  onEvent: (event: string, payload: any) => void
) {
  const { socket } = useSocketContext();
  const callbackRef = useRef(onEvent);
  callbackRef.current = onEvent;

  useEffect(() => {
    if (!socket || !pollId) return;
    socket.emit('join-poll', pollId);
    return () => {
      socket.emit('leave-poll', pollId);
    };
  }, [socket, pollId]);
}

export { useSocketContext };

// Made with Bob
