import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!email || !password) {
      setError('Es necesario llenar todos los campos');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Login con:', email, password);
      

      const mockUser = {
        rol: email.includes('teacher') ? 'maestro' : 'alumno',
        nombre: email.split('@')[0]
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Redirigir según rol
      if (mockUser.rol === 'maestro') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="login-page">
    <div className="login-container">
      <div className="login-welcome">
        <h1 className="login-logo">PollClass</h1>
      </div>

      <div className="login-form-container">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Iniciar Sesión</h2>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="login-options">
              <div className="login-option">
                <label className="login-option-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="login-input"
                />
              </div>

              <div className="login-option">
                <label className="login-option-label">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="login-input"
                />
              </div>

              {error && <p className="error-message">{error}</p>}

              <button
                type="submit"
                className="btn-login btn-teacher"
                disabled={isLoading}
              >
                {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
            </div>

            <div className="login-footer">
              <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
};
export default Login;
