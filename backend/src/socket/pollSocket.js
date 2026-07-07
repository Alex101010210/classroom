const socketIO = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a poll room
    socket.on('join-poll', (pollId) => {
      socket.join(`poll-${pollId}`);
      console.log(`Client ${socket.id} joined poll ${pollId}`);
    });

    // Leave a poll room
    socket.on('leave-poll', (pollId) => {
      socket.leave(`poll-${pollId}`);
      console.log(`Client ${socket.id} left poll ${pollId}`);
    });

    // Join an encuesta results room (for real-time teacher dashboard)
    socket.on('join-encuesta', (encuestaId) => {
      socket.join(`encuesta-${encuestaId}`);
      console.log(`Client ${socket.id} joined encuesta ${encuestaId}`);
    });

    socket.on('leave-encuesta', (encuestaId) => {
      socket.leave(`encuesta-${encuestaId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };


