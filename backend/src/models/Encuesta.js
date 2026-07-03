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
  // Preguntas almacenadas como JSON en columna TEXT
  preguntas: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
    get() {
      const raw = this.getDataValue('preguntas');
      if (!raw) return [];
      try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return []; }
    },
    set(val) {
      this.setDataValue('preguntas', typeof val === 'string' ? val : JSON.stringify(val));
    }
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'encuestas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Encuesta;

// Made with Bob
