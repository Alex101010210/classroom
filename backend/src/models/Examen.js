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
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Examen;

// Made with Bob
