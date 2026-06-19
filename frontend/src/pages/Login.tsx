import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleTeacherLogin = () => {
    // Aquí irá la lógica de autenticación con el backend
    // Por ahora solo navegamos al dashboard
    navigate('/teacher/dashboard');
  };

  const handleStudentLogin = () => {
    // Aquí irá la lógica de autenticación para estudiantes
    // Por ahora mostramos un mensaje
    alert('Login de estudiante - Por implementar');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left side - Welcome section */}
        <div className="login-welcome">
          <h1 className="login-logo">PollClass</h1>
        </div>

        {/* Right side - Login form */}
        <div className="login-form-container">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Bienvenido</h2>
              <p>Selecciona tu tipo de usuario para continuar</p>
            </div>

            <div className="login-options">
              <div className="login-option">
                <span className="login-option-label">Registro para Profesores</span>
                <button 
                  className="btn-login btn-teacher"
                  onClick={handleTeacherLogin}
                >
                  <span>Acceso Maestro</span>
                </button>
              </div>

              <div className="login-divider">
                <span>o</span>
              </div>

              <div className="login-option">
                <span className="login-option-label">Registro para Estudiantes</span>
                <button 
                  className="btn-login btn-student"
                  onClick={handleStudentLogin}>
                  <span>Acceso Alumno</span>
                </button>
              </div>
            </div>

            <div className="login-footer">
              <div className="status-badges">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;