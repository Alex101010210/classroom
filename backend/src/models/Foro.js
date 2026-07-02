const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Foro = sequelize.define('Foro', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'titulo'
  },
  descrip_foro: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descrip_foro'
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'fecha_inicio'
  },
  activo_foro: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'activo_foro'
  },
  obejtivo_foro: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'obejtivo_foro'
  },
  pregunta: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'pregunta'
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'fecha_fin'
  },
  links: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'links'
  }
}, {
  tableName: 'foros',
  timestamps: false
});

module.exports = Foro;

// Made with Bob
