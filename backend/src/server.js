const app = require('./app');
const { initSocket } = require('./socket/pollSocket');
const { connectDB } = require('./config/db');
const config = require('./config/env');

const PORT = config.port;

// Conectar a base de datos
connectDB();

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

// Inicializar Socket.io
initSocket(server);