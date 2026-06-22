const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  maestro_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'maestro_id'
  },
  nombre_class: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'nombre_class'
  },
  descrip_class: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descrip_class'
  },
  color_class: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'color_class'
  },
  activa_class: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'activa_class'
  }
}, {
  tableName: 'clases',
  timestamps: false
});

module.exports = Class;

