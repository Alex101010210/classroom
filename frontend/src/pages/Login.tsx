import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="container">
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '100vh' }}>
        <h1 className="text-4xl font-bold mb-lg">Classroom Polling & Analytics</h1>
        <p className="text-secondary text-center mb-xl">
          Sistema de polling en tiempo real para educación
        </p>
        
        <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
          <h2 className="text-2xl font-semibold mb-md">Bienvenido</h2>
          <p className="text-secondary mb-lg">
            Selecciona tu tipo de usuario para continuar
          </p>
          
          <div className="flex gap-md">
            <button 
              className="p-md font-medium"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--text-inverse)',
                borderRadius: 'var(--border-radius-md)',
                flex: 1
              }}
              onClick={handleTeacherLogin}
            >
              Login Maestro
            </button>
            <button 
              className="p-md font-medium"
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--text-inverse)',
                borderRadius: 'var(--border-radius-md)',
                flex: 1
              }}
              onClick={handleStudentLogin}
            >
              Login Alumno
            </button>
          </div>
        </div>
        
        <div className="mt-xl">
          <span className="badge badge-primary">Backend Ready</span>
          <span className="badge badge-success ml-sm">Styles Ready</span>
        </div>
      </div>
    </div>
  );
};

export default Login;