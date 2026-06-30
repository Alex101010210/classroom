const Task = require('../models/Task');
const Class = require('../models/Class');

// Crear tarea para una clase
exports.createTask = async (req, res) => {
  try {
    const { classId } = req.params;
    const maestro_id = req.user.id;

    // Verificar que la clase pertenece al maestro
    const classData = await Class.findOne({ where: { id: classId, maestro_id } });
    if (!classData) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    const { titulo_tarea, descrip_tarea, fecha_limite, puntos_max_tarea, entrega_tardia, archivos_adjuntos } = req.body;

    if (!titulo_tarea || titulo_tarea.trim() === '') {
      return res.status(400).json({ message: 'El título de la tarea es requerido' });
    }
    if (!fecha_limite) {
      return res.status(400).json({ message: 'La fecha límite es requerida' });
    }
    if (puntos_max_tarea === undefined || puntos_max_tarea === null) {
      return res.status(400).json({ message: 'Los puntos máximos son requeridos' });
    }

    const newTask = await Task.create({
      clase_id: classId,
      titulo_tarea: titulo_tarea.trim(),
      descrip_tarea: descrip_tarea ? descrip_tarea.trim() : null,
      fecha_creacion: new Date(),
      fecha_limite: new Date(fecha_limite),
      puntos_max_tarea: parseInt(puntos_max_tarea, 10),
      entrega_tardia: entrega_tardia === true || entrega_tardia === 'true',
      archivos_adjuntos: archivos_adjuntos || null
    });

    res.status(201).json({ message: 'Tarea creada exitosamente', task: newTask });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
  }
};

// Obtener tareas de una clase
exports.getTasksByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const maestro_id = req.user.id;

    // Verificar que la clase pertenece al maestro
    const classData = await Class.findOne({ where: { id: classId, maestro_id } });
    if (!classData) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    const tasks = await Task.findAll({
      where: { clase_id: classId },
      order: [['fecha_creacion', 'DESC']]
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas', error: error.message });
  }
};

// Obtener una tarea específica
exports.getTaskById = async (req, res) => {
  try {
    const { classId, taskId } = req.params;
    const maestro_id = req.user.id;

    const classData = await Class.findOne({ where: { id: classId, maestro_id } });
    if (!classData) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    const task = await Task.findOne({ where: { id: taskId, clase_id: classId } });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({ message: 'Error al obtener la tarea', error: error.message });
  }
};

// Actualizar tarea (descripcion, fecha_limite, entrega_tardia)
exports.updateTask = async (req, res) => {
  try {
    const { classId, taskId } = req.params;
    const maestro_id = req.user.id;

    const classData = await Class.findOne({ where: { id: classId, maestro_id } });
    if (!classData) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    const task = await Task.findOne({ where: { id: taskId, clase_id: classId } });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const { descrip_tarea, fecha_limite, entrega_tardia } = req.body;

    await task.update({
      descrip_tarea: descrip_tarea !== undefined ? descrip_tarea : task.descrip_tarea,
      fecha_limite: fecha_limite ? new Date(fecha_limite) : task.fecha_limite,
      entrega_tardia: entrega_tardia !== undefined ? (entrega_tardia === true || entrega_tardia === 'true') : task.entrega_tardia
    });

    res.json({ message: 'Tarea actualizada exitosamente', task });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
  }
};

// Eliminar tarea
exports.deleteTask = async (req, res) => {
  try {
    const { classId, taskId } = req.params;
    const maestro_id = req.user.id;

    const classData = await Class.findOne({ where: { id: classId, maestro_id } });
    if (!classData) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    const task = await Task.findOne({ where: { id: taskId, clase_id: classId } });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    await task.destroy();
    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ message: 'Error al eliminar la tarea', error: error.message });
  }
};

// Made with Bob
