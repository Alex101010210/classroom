const app = require('./app');
const { initSocket } = require('./socket/pollSocket');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Conectar a base de datos
connectDB();

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Inicializar Socket.io
initSocket(server);