import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de Clases
export const classService = {
  // Crear nueva clase
  createClass: async (classData: {
    nombre_class: string;
    descrip_class?: string;
    color_class?: string;
  }) => {
    const response = await api.post('/classes', classData);
    return response.data;
  },

  // Obtener todas las clases del maestro
  getTeacherClasses: async () => {
    const response = await api.get('/classes');
    return response.data;
  },

  // Obtener una clase específica por ID
  getClassById: async (id: string) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  // Actualizar clase
  updateClass: async (
    id: string,
    classData: {
      nombre_class?: string;
      descrip_class?: string;
      color_class?: string;
    }
  ) => {
    const response = await api.put(`/classes/${id}`, classData);
    return response.data;
  },

  // Eliminar clase (soft delete)
  deleteClass: async (id: string) => {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  },
};

// Tipos para el perfil de usuario
export interface ProfileData {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  departamento: string | null;
  biografia: string | null;
}

export interface ProfileUpdateData {
  telefono?: string;
  departamento?: string;
  biografia?: string;
}

// Servicios de Perfil
export const profileService = {
  // Obtener el perfil del usuario autenticado
  getProfile: async (): Promise<ProfileData> => {
    const response = await api.get('/profile');
    // El backend devuelve { success: true, data: { ... } }
    return response.data?.data ?? response.data;
  },

  // Actualizar los campos opcionales del perfil
  updateProfile: async (data: ProfileUpdateData): Promise<ProfileData> => {
    const response = await api.put('/profile', data);
    return response.data?.data ?? response.data;
  },
};

export default api;

// Made with Bob
