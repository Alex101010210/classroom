const app = require('./app');
const { initSocket } = require('./socket/pollSocket');
const { connectDB, sequelize } = require('./config/db');
const config = require('./config/env');

// Registrar modelos para que sequelize.sync los cree
require('./models/User');
require('./models/Class');
require('./models/Enrollment');
require('./models/UserProfile');
require('./models/Encuesta');
require('./models/Examen');

const PORT = config.port;

// Conectar a base de datos, sincronizar modelos y luego iniciar servidor
const startServer = async () => {
  await connectDB();

  // Sincronizar modelos con la base de datos (solo en desarrollo)
  if (config.nodeEnv === 'development') {
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synced');
  }

  // Iniciar servidor solo después de que la DB esté lista
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
  });

  // Inicializar Socket.io
  initSocket(server);
};

startServer().catch((error) => {
  console.error('❌ Error al iniciar el servidor:', error);
  process.exit(1);
});