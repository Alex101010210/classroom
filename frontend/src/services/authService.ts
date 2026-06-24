import api from './api';

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: 'maestro' | 'alumno';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: number;
      email: string;
      nombre: string;
      apellido: string;
      rol: number;
    };
    token: string;
  };
  message?: string;
}

export const authService = {
  // Registrar nuevo usuario
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    
    // Guardar token en localStorage
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // Iniciar sesión
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    
    // Guardar token en localStorage
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si hay sesión activa
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Made with Bob
