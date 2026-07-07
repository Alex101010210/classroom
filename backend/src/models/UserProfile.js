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

// Asociación lógica sin constraint físico en DB (evita ALTER TABLE DROP CONSTRAINT en sync)
UserProfile.belongsTo(User, { foreignKey: 'id_usuario', constraints: false });

module.exports = UserProfile;

// Made with Bob
