const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Encuesta = sequelize.define('Encuesta', {
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
  // Preguntas almacenadas como JSON
  preguntas: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]'
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'encuestas',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false
});

module.exports = Encuesta;

// Made with Bob
