const app = require('./app');
const { initSocket } = require('./socket/pollSocket');
const { connectDB, sequelize } = require('./config/db');
const config = require('./config/env');

const PORT = config.port;

// Conectar a base de datos y sincronizar modelos
const startServer = async () => {
  await connectDB();
  
  // Sincronizar modelos con la base de datos
  await sequelize.sync({ alter: true });
  console.log('✅ Database models synced');
};

startServer();

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

// Inicializar Socket.io
initSocket(server);