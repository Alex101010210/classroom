const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Examen = sequelize.define('Examen', {
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
  color: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '#673ab7'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  one_attempt: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'examenes',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false
});

module.exports = Examen;

// Made with Bob
