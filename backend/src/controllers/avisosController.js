const Aviso = require('../models/Aviso');
const Class = require('../models/Class');
const Enrollment = require('../models/Enrollment');

// POST /api/classes/:classId/avisos — maestro crea aviso
exports.createAviso = async (req, res) => {
  try {
    const { classId } = req.params;
    const maestro_id = req.user.id;

    const classData = await Class.findOne({ where: { id: classId, maestro_id } });
    if (!classData) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    const { fecha, mensaje, nombre_maestro } = req.body;
    if (!fecha || !mensaje || !nombre_maestro) {
      return res.status(400).json({ message: 'fecha, mensaje y nombre_maestro son requeridos' });
    }

    const aviso = await Aviso.create({
      clase_id: classId,
      maestro_id,
      fecha,
      mensaje: mensaje.trim(),
      nombre_maestro: nombre_maestro.trim()
    });

    res.status(201).json({ aviso });
  } catch (error) {
    console.error('Error al crear aviso:', error);
    res.status(500).json({ message: 'Error al crear aviso', error: error.message });
  }
};

// GET /api/classes/:classId/avisos — maestro y alumno leen avisos
exports.getAvisos = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user.id;
    const rol = req.user.rol;

    if (rol === 'maestro') {
      // Verificar que la clase pertenece al maestro
      const classData = await Class.findOne({ where: { id: classId, maestro_id: userId } });
      if (!classData) {
        return res.status(404).json({ message: 'Clase no encontrada' });
      }
    } else {
      // Verificar que el alumno está inscrito
      const inscrito = await Enrollment.findOne({ where: { clase_id: classId, alumno_id: userId, activa: true } });
      if (!inscrito) {
        return res.status(403).json({ message: 'No estás inscrito en esta clase' });
      }
    }

    const avisos = await Aviso.findAll({
      where: { clase_id: classId },
      order: [['creado_en', 'DESC']]
    });

    res.json({ avisos });
  } catch (error) {
    console.error('Error al obtener avisos:', error);
    res.status(500).json({ message: 'Error al obtener avisos', error: error.message });
  }
};

// DELETE /api/classes/:classId/avisos/:avisoId — maestro elimina aviso
exports.deleteAviso = async (req, res) => {
  try {
    const { classId, avisoId } = req.params;
    const maestro_id = req.user.id;

    const classData = await Class.findOne({ where: { id: classId, maestro_id } });
    if (!classData) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    const aviso = await Aviso.findOne({ where: { id: avisoId, clase_id: classId } });
    if (!aviso) {
      return res.status(404).json({ message: 'Aviso no encontrado' });
    }

    await aviso.destroy();
    res.json({ message: 'Aviso eliminado' });
  } catch (error) {
    console.error('Error al eliminar aviso:', error);
    res.status(500).json({ message: 'Error al eliminar aviso', error: error.message });
  }
};
