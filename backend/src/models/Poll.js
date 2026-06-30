const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Modelo principal de una encuesta/poll
const Poll = sequelize.define('Poll', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clase_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maestro_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  titulo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Preguntas almacenadas como JSON: [{ id, texto, tipo, opciones, respuesta_correcta, puntos }]
  preguntas: {
    type: DataTypes.TEXT, // JSON serializado
    allowNull: false,
    defaultValue: '[]',
    get() {
      const raw = this.getDataValue('preguntas');
      try { return JSON.parse(raw); } catch { return []; }
    },
    set(val) {
      this.setDataValue('preguntas', JSON.stringify(val));
    }
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  tiempo_limite: {
    type: DataTypes.INTEGER, // minutos, null = sin límite
    allowNull: true
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'encuestas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Modelo de respuesta de un alumno a una encuesta
const PollResponse = sequelize.define('PollResponse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  poll_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  alumno_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // Respuestas: [{ questionId, answer }]
  respuestas: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
    get() {
      const raw = this.getDataValue('respuestas');
      try { return JSON.parse(raw); } catch { return []; }
    },
    set(val) {
      this.setDataValue('respuestas', JSON.stringify(val));
    }
  },
  calificacion: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  calificacion_max: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  porcentaje: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'respuestas_encuestas',
  timestamps: true,
  createdAt: 'submitted_at',
  updatedAt: false
});

module.exports = { Poll, PollResponse };

// Made with Bob
