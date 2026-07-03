const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Comentario = sequelize.define('Comentario', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  foro_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  autor_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  autor_nombre: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'comentarios_foros',
  timestamps: false
});

module.exports = Comentario;
