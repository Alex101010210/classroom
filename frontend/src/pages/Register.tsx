import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Login.css'; // Reutilizamos los estilos del login

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState<'maestro' | 'alumno'>('alumno');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validaciones
    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      setIsLoading(false);
      return;
    }

    try {
      // Llamar al servicio de registro
      const response = await authService.register({
        email: email.trim(),
        password,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        rol
      });

      if (response.success) {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión');
        navigate('/login');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse. Intenta de nuevo';
      setError(errorMessage);
      console.error('Error en registro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-welcome">
          <h1 className="login-logo">PollClass</h1>
          <p className="login-tagline">
            Únete a nuestra plataforma educativa
          </p>
        </div>

        <div className="login-form-container">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Crear Cuenta</h2>
              <p>Completa el formulario para registrarte</p>
            </div>

            <form onSubmit={handleRegister}>
              <div className="login-options">
                <div className="login-option">
                  <label className="login-option-label">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Juan"
                    className="login-input"
                  />
                </div>

                <div className="login-option">
                  <label className="login-option-label">Apellido</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Pérez"
                    className="login-input"
                  />
                </div>

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
                    placeholder="Mínimo 6 caracteres"
                    className="login-input"
                  />
                </div>

                <div className="login-option">
                  <label className="login-option-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className="login-input"
                  />
                </div>

                <div className="login-option">
                  <label className="login-option-label">Tipo de Usuario</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="rol"
                        value="maestro"
                        checked={rol === 'maestro'}
                        onChange={(e) => setRol(e.target.value as 'maestro' | 'alumno')}
                        className="radio-input"
                      />
                      <span>🎓 Maestro</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="rol"
                        value="alumno"
                        checked={rol === 'alumno'}
                        onChange={(e) => setRol(e.target.value as 'maestro' | 'alumno')}
                        className="radio-input"
                      />
                      <span>📚 Alumno</span>
                    </label>
                  </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button
                  type="submit"
                  className="btn-login btn-teacher"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                </button>
              </div>

              <div className="login-footer">
                <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
