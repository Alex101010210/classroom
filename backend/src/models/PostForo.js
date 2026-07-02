const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const PostForo = sequelize.define('PostForo', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  foro_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'foro_id'
  },
  usuario_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'usuario_id'
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'contenido'
  },
  fecha_publicacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha-publicacio'
  }
}, {
  tableName: 'post-foro',
  timestamps: false
});

// Asociación: cada post pertenece a un usuario (autor)
PostForo.belongsTo(User, { foreignKey: 'usuario_id', as: 'autor' });

module.exports = PostForo;

// Made with Bob
