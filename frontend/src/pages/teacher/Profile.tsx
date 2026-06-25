import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faEnvelope, faPhone, faBuilding, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { profileService, ProfileUpdateData } from '../../services/api';
import { authService } from '../../services/authService';
import './Profile.css';

// Campos de solo lectura (vienen de 'usuarios' vía localStorage)
interface ReadOnlyFields {
  nombre: string;
  apellido: string;
  email: string;
}

// Campos editables (vienen de 'info_usuarios' vía API)
interface EditableFields {
  telefono: string;
  departamento: string;
  biografia: string;
}

const TeacherProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Datos de solo lectura — cargados desde localStorage sin petición extra
  const currentUser = authService.getCurrentUser();
  const readOnly: ReadOnlyFields = {
    nombre: currentUser?.nombre || '',
    apellido: currentUser?.apellido || '',
    email: currentUser?.email || '',
  };

  // Datos editables — cargados desde la API
  const [editableFields, setEditableFields] = useState<EditableFields>({
    telefono: '',
    departamento: '',
    biografia: '',
  });
  const [editDraft, setEditDraft] = useState<EditableFields>(editableFields);

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        const loaded: EditableFields = {
          telefono: data.telefono || '',
          departamento: data.departamento || '',
          biografia: data.biografia || '',
        };
        setEditableFields(loaded);
        setEditDraft(loaded);
      } catch (err) {
        // Si falla, los campos quedan vacíos — no es un error crítico
        console.error('Error al cargar perfil:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleBack = () => {
    navigate('/teacher/dashboard');
  };

  const handleEdit = () => {
    setEditDraft(editableFields);
    setSaveError(null);
    setSaveSuccess(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditDraft(editableFields);
    setSaveError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const payload: ProfileUpdateData = {
        telefono: editDraft.telefono || undefined,
        departamento: editDraft.departamento || undefined,
        biografia: editDraft.biografia || undefined,
      };
      await profileService.updateProfile(payload);
      setEditableFields(editDraft);
    setIsEditing(false);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError('No se pudo guardar el perfil. Intenta de nuevo.');
    }
  };

  const handleChange = (field: keyof EditableFields, value: string) => {
    setEditDraft({ ...editDraft, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <header className="profile-header">
          <button className="btn-back" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Volver al Dashboard</span>
          </button>
          <h1>Mi Perfil</h1>
        </header>
        <div className="profile-content">
          <p className="loading-text">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const displayName = `${readOnly.nombre} ${readOnly.apellido}`.trim() || 'Sin nombre';

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="btn-back" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver al Dashboard</span>
        </button>
        <h1>Mi Perfil</h1>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <h2>{displayName}</h2>
            <p className="profile-role">Profesor</p>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button className="btn-edit" onClick={handleEdit}>
                <FontAwesomeIcon icon={faEdit} />
                <span>Editar Perfil</span>
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn-save" onClick={handleSave}>
                  <FontAwesomeIcon icon={faSave} />
                  <span>Guardar</span>
                </button>
                <button className="btn-cancel" onClick={handleCancel}>
                  <FontAwesomeIcon icon={faTimes} />
                  <span>Cancelar</span>
                </button>
              </div>
            )}
          </div>

          {saveSuccess && (
            <p className="save-success">Perfil actualizado exitosamente.</p>
          )}
          {saveError && (
            <p className="save-error">{saveError}</p>
          )}

          <div className="profile-info">
            <div className="info-section">
              <h3>Información Personal</h3>
              
              {/* Nombre completo — solo lectura */}
              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faUser} />
                  <span>Nombre Completo</span>
                </div>
                <p className="info-value">{displayName}</p>
              </div>

              {/* Correo — solo lectura */}
              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>Correo Electrónico</span>
                </div>
                <p className="info-value">{readOnly.email}</p>
              </div>

              {/* Teléfono — editable */}
              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faPhone} />
                  <span>Teléfono</span>
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    className="info-input"
                    value={editDraft.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                    placeholder="Ej: +52 123 456 7890"
                  />
                ) : (
                  <p className="info-value">
                    {editableFields.telefono || <span className="info-empty">No especificado</span>}
                  </p>
                )}
              </div>

              {/* Departamento — editable */}
              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faBuilding} />
                  <span>Departamento</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    className="info-input"
                    value={editDraft.departamento}
                    onChange={(e) => handleChange('departamento', e.target.value)}
                    placeholder="Ej: Departamento de Ciencias"
                  />
                ) : (
                  <p className="info-value">
                    {editableFields.departamento || <span className="info-empty">No especificado</span>}
                  </p>
                )}
              </div>
            </div>

            <div className="info-section">
              <h3>Biografía</h3>
              <div className="info-item">
                {isEditing ? (
                  <textarea
                    className="info-textarea"
                    value={editDraft.biografia}
                    onChange={(e) => handleChange('biografia', e.target.value)}
                    rows={4}
                    placeholder="Escribe una breve descripción sobre ti..."
                  />
                ) : (
                  <p className="info-value bio">
                    {editableFields.biografia || <span className="info-empty">Sin biografía</span>}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;

// Made with Bob
