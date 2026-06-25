const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clase_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'clase_id'
  },
  alumno_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'alumno_id'
  },
  fechaInscripcion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha-inscripcion'
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'activa'
  }
}, {
  tableName: 'inscripciones',
  timestamps: false
});

module.exports = Enrollment;

// Made with Bob
