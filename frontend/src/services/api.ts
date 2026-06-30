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

// Tipos de inscripciones
export interface StudentEnrollment {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaInscripcion: string | null;
  inscripcion_id: number | null;
}

// Tipo para las clases del alumno
export interface StudentClass {
  id: number;
  nombre_class: string;
  descrip_class: string | null;
  color_class: string | null;
  fechaInscripcion: string | null;
}

// Servicios de Inscripciones
export const enrollmentService = {
  // Obtener las clases en las que está inscrito el alumno autenticado
  getMyClasses: async (): Promise<StudentClass[]> => {
    const response = await api.get('/classes/my-classes');
    return response.data.classes;
  },

  // Obtener alumnos inscritos en una clase
  getStudents: async (claseId: string): Promise<StudentEnrollment[]> => {
    const response = await api.get(`/classes/${claseId}/students`);
    return response.data.students;
  },

  // Inscribir alumno por email
  enrollStudent: async (claseId: string, email: string): Promise<StudentEnrollment> => {
    const response = await api.post(`/classes/${claseId}/students`, { email });
    return response.data.student;
  },

  // Dar de baja a un alumno (soft delete)
  removeStudent: async (claseId: string, alumnoId: number): Promise<void> => {
    await api.delete(`/classes/${claseId}/students/${alumnoId}`);
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

// ─── Encuestas ────────────────────────────────────────────────────────────────

export interface EncuestaPayload {
  clase_id: number | string;
  titulo: string;
  descripcion?: string;
  preguntas: any[];
}

export interface EncuestaDB {
  id: number;
  clase_id: number;
  titulo: string;
  descripcion: string | null;
  preguntas: any[];
  activa: boolean;
  creado_en: string;
}

export const encuestaService = {
  create: async (data: EncuestaPayload): Promise<EncuestaDB> => {
    const res = await api.post('/encuestas', data);
    return res.data.encuesta;
  },
  getById: async (id: number | string): Promise<EncuestaDB> => {
    const res = await api.get(`/encuestas/${id}`);
    return res.data.encuesta;
  },
  update: async (id: number | string, data: Partial<EncuestaPayload>): Promise<EncuestaDB> => {
    const res = await api.put(`/encuestas/${id}`, data);
    return res.data.encuesta;
  },
  getByClaseMaestro: async (claseId: number | string): Promise<EncuestaDB[]> => {
    const res = await api.get(`/encuestas/clase/${claseId}`);
    return res.data.encuestas;
  },
  getByClaseAlumno: async (claseId: number | string): Promise<EncuestaDB[]> => {
    const res = await api.get(`/encuestas/alumno/${claseId}`);
    return res.data.encuestas;
  },
  delete: async (id: number | string): Promise<void> => {
    await api.delete(`/encuestas/${id}`);
  },
};

// ─── Exámenes ─────────────────────────────────────────────────────────────────

export interface ExamenPayload {
  clase_id: number | string;
  titulo: string;
  descripcion?: string;
  preguntas: any[];
  color?: string;
  deadline?: string | null;
  one_attempt?: boolean;
}

export interface ExamenDB {
  id: number;
  clase_id: number;
  titulo: string;
  descripcion: string | null;
  preguntas: any[];
  color: string;
  deadline: string | null;
  one_attempt: boolean;
  activo: boolean;
  creado_en: string;
}

export const examenService = {
  create: async (data: ExamenPayload): Promise<ExamenDB> => {
    const res = await api.post('/examenes', data);
    return res.data.examen;
  },
  getById: async (id: number | string): Promise<ExamenDB> => {
    const res = await api.get(`/examenes/${id}`);
    return res.data.examen;
  },
  update: async (id: number | string, data: Partial<ExamenPayload>): Promise<ExamenDB> => {
    const res = await api.put(`/examenes/${id}`, data);
    return res.data.examen;
  },
  getByClaseMaestro: async (claseId: number | string): Promise<ExamenDB[]> => {
    const res = await api.get(`/examenes/clase/${claseId}`);
    return res.data.examenes;
  },
  getByClaseAlumno: async (claseId: number | string): Promise<ExamenDB[]> => {
    const res = await api.get(`/examenes/alumno/${claseId}`);
    return res.data.examenes;
  },
  delete: async (id: number | string): Promise<void> => {
    await api.delete(`/examenes/${id}`);
  },
};

export default api;

// Made with Bob
