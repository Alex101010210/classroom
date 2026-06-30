import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPenToSquare, faSave, faTimes, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { taskService, TaskData } from '../../services/api';
import './TareaDetail.css';

const TareaDetail: React.FC = () => {
  const navigate = useNavigate();
  const { classId, taskId } = useParams<{ classId: string; taskId: string }>();

  const [task, setTask] = useState<TaskData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  // Campos editables
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editFechaLimite, setEditFechaLimite] = useState('');
  const [editEntregaTardia, setEditEntregaTardia] = useState(false);

  const loadTask = useCallback(async () => {
    if (!classId || !taskId) return;
    try {
      const data = await taskService.getTaskById(classId, taskId);
      setTask(data);
      // Inicializar campos de edición
      setEditDescripcion(data.descrip_tarea || '');
      setEditFechaLimite(toDatetimeLocal(data.fecha_limite));
      setEditEntregaTardia(data.entrega_tardia);
    } catch {
      setPageError('No se pudo cargar la tarea');
    }
  }, [classId, taskId]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadTask();
      setIsLoading(false);
    };
    init();
  }, [loadTask]);

  const handleBack = () => navigate(`/teacher/class/${classId}`);

  const handleEdit = () => {
    if (!task) return;
    setEditDescripcion(task.descrip_tarea || '');
    setEditFechaLimite(toDatetimeLocal(task.fecha_limite));
    setEditEntregaTardia(task.entrega_tardia);
    setSaveError('');
    setSaveSuccess('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !taskId) return;
    setSaveError('');
    setSaveSuccess('');
    setIsSaving(true);
    try {
      const updated = await taskService.updateTask(classId, taskId, {
        descrip_tarea: editDescripcion.trim() || undefined,
        fecha_limite: editFechaLimite,
        entrega_tardia: editEntregaTardia
      });
      setTask(prev => prev ? { ...prev, ...updated } : updated);
      setIsEditing(false);
      setSaveSuccess('Tarea actualizada correctamente');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err: any) {
      setSaveError(err.response?.data?.message || 'Error al actualizar la tarea');
    } finally {
      setIsSaving(false);
    }
  };

  // Convierte un timestamp ISO a valor compatible con datetime-local input
  const toDatetimeLocal = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="tarea-detail-page">
        <div className="tarea-loading">Cargando tarea...</div>
      </div>
    );
  }

  if (pageError || !task) {
    return (
      <div className="tarea-detail-page">
        <div className="tarea-loading">{pageError || 'Tarea no encontrada'}</div>
      </div>
    );
  }

  return (
    <div className="tarea-detail-page">
      <header className="tarea-detail-header">
        <button className="btn-back" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver a la Clase</span>
        </button>
        <div className="tarea-header-title">
          <FontAwesomeIcon icon={faClipboardList} />
          <h1>{task.titulo_tarea}</h1>
        </div>
      </header>

      <div className="tarea-detail-content">
        {saveSuccess && (
          <div className="tarea-success-banner">{saveSuccess}</div>
        )}

        <div className="tarea-card">
          {/* Información fija */}
          <section className="tarea-section">
            <h2>Información General</h2>
            <div className="tarea-info-grid">
              <div className="tarea-info-item">
                <span className="tarea-info-label">Puntos máximos</span>
                <span className="tarea-info-value">{task.puntos_max_tarea}</span>
              </div>
              <div className="tarea-info-item">
                <span className="tarea-info-label">Fecha de creación</span>
                <span className="tarea-info-value">{formatDate(task.fecha_creacion)}</span>
              </div>
            </div>
          </section>

          {/* Campos editables en modo vista */}
          {!isEditing ? (
            <section className="tarea-section">
              <div className="tarea-section-header">
                <h2>Detalle</h2>
                <button className="btn-edit" onClick={handleEdit}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <span>Editar</span>
                </button>
              </div>

              <div className="tarea-info-grid">
                <div className="tarea-info-item full-width">
                  <span className="tarea-info-label">Descripción</span>
                  <p className="tarea-info-description">
                    {task.descrip_tarea || <em className="tarea-no-value">Sin descripción</em>}
                  </p>
                </div>
                <div className="tarea-info-item">
                  <span className="tarea-info-label">Fecha límite</span>
                  <span className="tarea-info-value">{formatDate(task.fecha_limite)}</span>
                </div>
                <div className="tarea-info-item">
                  <span className="tarea-info-label">Entrega tardía</span>
                  <span className={`tarea-badge ${task.entrega_tardia ? 'tarea-badge-yes' : 'tarea-badge-no'}`}>
                    {task.entrega_tardia ? 'Permitida' : 'No permitida'}
                  </span>
                </div>
              </div>
            </section>
          ) : (
            /* Modo edición */
            <section className="tarea-section">
              <div className="tarea-section-header">
                <h2>Editando</h2>
              </div>
              <form className="tarea-edit-form" onSubmit={handleSave}>
                <div className="tarea-form-group">
                  <label htmlFor="edit-descrip">Descripción</label>
                  <textarea
                    id="edit-descrip"
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                    rows={5}
                    placeholder="Describe la tarea..."
                    disabled={isSaving}
                  />
                </div>

                <div className="tarea-form-group">
                  <label htmlFor="edit-fecha">Fecha Límite</label>
                  <input
                    type="datetime-local"
                    id="edit-fecha"
                    value={editFechaLimite}
                    onChange={(e) => setEditFechaLimite(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="tarea-form-group tarea-form-inline">
                  <input
                    type="checkbox"
                    id="edit-tardia"
                    checked={editEntregaTardia}
                    onChange={(e) => setEditEntregaTardia(e.target.checked)}
                    disabled={isSaving}
                  />
                  <label htmlFor="edit-tardia">Permitir entrega tardía</label>
                </div>

                {saveError && (
                  <p className="tarea-error">{saveError}</p>
                )}

                <div className="tarea-form-actions">
                  <button type="button" className="btn-cancel" onClick={handleCancel} disabled={isSaving}>
                    <FontAwesomeIcon icon={faTimes} />
                    <span>Cancelar</span>
                  </button>
                  <button type="submit" className="btn-save" disabled={isSaving}>
                    <FontAwesomeIcon icon={faSave} />
                    <span>{isSaving ? 'Guardando...' : 'Guardar cambios'}</span>
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Archivo adjunto */}
          {task.archivos_adjuntos && (
            <section className="tarea-section">
              <h2>Archivo Adjunto</h2>
              <p className="tarea-info-value">{task.archivos_adjuntos}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TareaDetail;

// Made with Bob
