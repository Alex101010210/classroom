const Foro = require('../models/Foro');

// Crear foro
exports.createForo = async (req, res) => {
  try {
    const { titulo, descrip_foro, fecha_inicio, obejtivo_foro, pregunta, fecha_fin, links } = req.body;

    if (!titulo || titulo.trim() === '') {
      return res.status(400).json({ message: 'El título del foro es requerido' });
    }
    if (!fecha_inicio) {
      return res.status(400).json({ message: 'La fecha de inicio es requerida' });
    }
    if (!fecha_fin) {
      return res.status(400).json({ message: 'La fecha fin es requerida' });
    }
    if (!obejtivo_foro || obejtivo_foro.trim() === '') {
      return res.status(400).json({ message: 'El objetivo del foro es requerido' });
    }
    if (!pregunta || pregunta.trim() === '') {
      return res.status(400).json({ message: 'La pregunta detonadora es requerida' });
    }

    const newForo = await Foro.create({
      titulo: titulo.trim(),
      descrip_foro: descrip_foro ? descrip_foro.trim() : null,
      fecha_inicio: new Date(fecha_inicio),
      activo_foro: true,
      obejtivo_foro: obejtivo_foro.trim(),
      pregunta: pregunta.trim(),
      fecha_fin: new Date(fecha_fin),
      links: links || null
    });

    res.status(201).json({ message: 'Foro creado exitosamente', foro: newForo });
  } catch (error) {
    console.error('Error al crear foro:', error);
    res.status(500).json({ message: 'Error al crear el foro', error: error.message });
  }
};

// Obtener todos los foros
exports.getForos = async (req, res) => {
  try {
    const foros = await Foro.findAll({
      order: [['fecha_inicio', 'DESC']]
    });
    res.json({ foros });
  } catch (error) {
    console.error('Error al obtener foros:', error);
    res.status(500).json({ message: 'Error al obtener los foros', error: error.message });
  }
};

// Obtener un foro específico
exports.getForoById = async (req, res) => {
  try {
    const { foroId } = req.params;
    const foro = await Foro.findByPk(foroId);
    if (!foro) {
      return res.status(404).json({ message: 'Foro no encontrado' });
    }
    res.json({ foro });
  } catch (error) {
    console.error('Error al obtener foro:', error);
    res.status(500).json({ message: 'Error al obtener el foro', error: error.message });
  }
};

// Eliminar foro
exports.deleteForo = async (req, res) => {
  try {
    const { foroId } = req.params;
    const foro = await Foro.findByPk(foroId);
    if (!foro) {
      return res.status(404).json({ message: 'Foro no encontrado' });
    }
    await foro.destroy();
    res.json({ message: 'Foro eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar foro:', error);
    res.status(500).json({ message: 'Error al eliminar el foro', error: error.message });
  }
};

// Made with Bob
