import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faEnvelope, faPhone, faBuilding, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  department: string;
  bio: string;
}

const TeacherProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Nombre del maestro',
    email: 'maestro@escuela.edu',
    phone: '+52 123 456 7890',
    department: 'Departamento de Ciencias',
    bio: 'Profesor dedicado con más de 10 años de experiencia en educación.'
  });
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleBack = () => {
    navigate('/teacher/dashboard');
  };

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // Aquí podrías guardar en localStorage o enviar al backend
    localStorage.setItem('teacherProfile', JSON.stringify(editedProfile));
    alert('Perfil actualizado exitosamente');
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

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
            <h2>{isEditing ? editedProfile.name : profile.name}</h2>
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

          <div className="profile-info">
            <div className="info-section">
              <h3>Información Personal</h3>
              
              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faUser} />
                  <span>Nombre Completo</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    className="info-input"
                    value={editedProfile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                ) : (
                  <p className="info-value">{profile.name}</p>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>Correo Electrónico</span>
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    className="info-input"
                    value={editedProfile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                ) : (
                  <p className="info-value">{profile.email}</p>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faPhone} />
                  <span>Teléfono</span>
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    className="info-input"
                    value={editedProfile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                ) : (
                  <p className="info-value">{profile.phone}</p>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FontAwesomeIcon icon={faBuilding} />
                  <span>Departamento</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    className="info-input"
                    value={editedProfile.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                  />
                ) : (
                  <p className="info-value">{profile.department}</p>
                )}
              </div>
            </div>

            <div className="info-section">
              <h3>Biografía</h3>
              <div className="info-item">
                {isEditing ? (
                  <textarea
                    className="info-textarea"
                    value={editedProfile.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={4}
                  />
                ) : (
                  <p className="info-value bio">{profile.bio}</p>
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


