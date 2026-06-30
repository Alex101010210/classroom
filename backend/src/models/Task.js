const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  clase_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'clase_id'
  },
  titulo_tarea: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'titulo_tarea'
  },
  descrip_tarea: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descrip_tarea'
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'fecha_creacion'
  },
  fecha_limite: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'fecha_limite'
  },
  puntos_max_tarea: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'puntos-max_tarea'
  },
  entrega_tardia: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'entrega_tardia'
  },
  archivos_adjuntos: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'archivos_adjuntos'
  }
}, {
  tableName: 'tareas',
  timestamps: false
});

module.exports = Task;

// Made with Bob
