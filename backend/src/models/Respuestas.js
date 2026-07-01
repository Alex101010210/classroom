const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Respuesta de un alumno a una encuesta
const RespuestaEncuesta = sequelize.define('RespuestaEncuesta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  poll_id: { type: DataTypes.INTEGER, allowNull: false },
  alumno_id: { type: DataTypes.INTEGER, allowNull: false },
  respuestas: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
    get() {
      const raw = this.getDataValue('respuestas');
      try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return []; }
    },
    set(val) {
      this.setDataValue('respuestas', typeof val === 'string' ? val : JSON.stringify(val));
    }
  },
  calificacion:     { type: DataTypes.FLOAT, allowNull: true },
  calificacion_max: { type: DataTypes.FLOAT, allowNull: true },
  porcentaje:       { type: DataTypes.FLOAT, allowNull: true },
}, {
  tableName: 'respuestas_encuestas',
  timestamps: true,
  createdAt: 'submitted_at',
  updatedAt: false
});

// Respuesta de un alumno a un examen
const RespuestaExamen = sequelize.define('RespuestaExamen', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  examen_id:  { type: DataTypes.INTEGER, allowNull: false },
  alumno_id:  { type: DataTypes.INTEGER, allowNull: false },
  respuestas: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
    get() {
      const raw = this.getDataValue('respuestas');
      try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return []; }
    },
    set(val) {
      this.setDataValue('respuestas', typeof val === 'string' ? val : JSON.stringify(val));
    }
  },
  calificacion:     { type: DataTypes.FLOAT, allowNull: true },
  calificacion_max: { type: DataTypes.FLOAT, allowNull: true },
  porcentaje:       { type: DataTypes.FLOAT, allowNull: true },
}, {
  tableName: 'respuestas_examenes',
  timestamps: true,
  createdAt: 'submitted_at',
  updatedAt: false
});

module.exports = { RespuestaEncuesta, RespuestaExamen };

// Made with Bob
