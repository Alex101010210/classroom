const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  telefono: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  departamento: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  biografia: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'info_usuario',
  timestamps: false
});

// Asociación: cada perfil pertenece a un usuario
UserProfile.belongsTo(User, { foreignKey: 'id_usuario' });

module.exports = UserProfile;

// Made with Bob
