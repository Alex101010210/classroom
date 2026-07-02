const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Aviso = sequelize.define('Aviso', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  clase_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  maestro_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  nombre_maestro: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'avisos',
  timestamps: false
});

module.exports = Aviso;
