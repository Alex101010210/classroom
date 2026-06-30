const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', routes);

// Error handling
app.use(errorMiddleware);

module.exports = app;