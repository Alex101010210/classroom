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

  // Obtener las clases donde el alumno autenticado está inscrito
  getStudentClasses: async () => {
    const response = await api.get('/classes/student');
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

// Servicios de Inscripciones
export const enrollmentService = {
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

// Tipos para tareas
export interface TaskData {
  id: number;
  clase_id: number;
  titulo_tarea: string;
  descrip_tarea: string | null;
  fecha_creacion: string;
  fecha_limite: string;
  puntos_max_tarea: number;
  entrega_tardia: boolean;
  archivos_adjuntos: string | null;
}

export interface CreateTaskPayload {
  titulo_tarea: string;
  descrip_tarea?: string;
  fecha_limite: string;
  puntos_max_tarea: number;
  entrega_tardia?: boolean;
  archivos_adjuntos?: string;
}

export interface UpdateTaskPayload {
  descrip_tarea?: string;
  fecha_limite?: string;
  entrega_tardia?: boolean;
}

// Servicios de Tareas
export const taskService = {
  // Obtener tareas de una clase
  getTasksByClass: async (classId: string): Promise<TaskData[]> => {
    const response = await api.get(`/classes/${classId}/tasks`);
    return response.data.tasks;
  },

  // Obtener una tarea específica
  getTaskById: async (classId: string, taskId: string): Promise<TaskData> => {
    const response = await api.get(`/classes/${classId}/tasks/${taskId}`);
    return response.data.task;
  },

  // Crear tarea
  createTask: async (classId: string, payload: CreateTaskPayload): Promise<TaskData> => {
    const response = await api.post(`/classes/${classId}/tasks`, payload);
    return response.data.task;
  },

  // Actualizar tarea
  updateTask: async (classId: string, taskId: string, payload: UpdateTaskPayload): Promise<TaskData> => {
    const response = await api.put(`/classes/${classId}/tasks/${taskId}`, payload);
    return response.data.task;
  },

  // Eliminar tarea
  deleteTask: async (classId: string, taskId: string): Promise<void> => {
    await api.delete(`/classes/${classId}/tasks/${taskId}`);
  },
};

export default api;

// Tipos para foros
export interface ForoData {
  id: number;
  clase_id: number;
  titulo: string;
  descrip_foro: string | null;
  fecha_inicio: string;
  activo_foro: boolean;
  obejtivo_foro: string;
  pregunta: string;
  fecha_fin: string;
  links: string | null;
}

export interface CreateForoPayload {
  titulo: string;
  descrip_foro?: string;
  fecha_inicio: string;
  obejtivo_foro: string;
  pregunta: string;
  fecha_fin: string;
  links?: string;
}

// Servicios de Foros
export const foroService = {
  // Obtener todos los foros
  getForos: async (): Promise<ForoData[]> => {
    const response = await api.get('/foros');
    return response.data.foros;
  },

  // Obtener un foro específico
  getForoById: async (foroId: string): Promise<ForoData> => {
    const response = await api.get(`/foros/${foroId}`);
    return response.data.foro;
  },

  // Crear foro
  createForo: async (payload: CreateForoPayload): Promise<ForoData> => {
    const response = await api.post('/foros', payload);
    return response.data.foro;
  },

  // Eliminar foro
  deleteForo: async (foroId: string): Promise<void> => {
    await api.delete(`/foros/${foroId}`);
  },
};

// Tipos para posts de foro
export interface PostForoData {
  id: number;
  foro_id: number;
  usuario_id: number;
  contenido: string;
  fecha_publicacion: string;
  autor: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

// Servicios de Posts de Foro
export const postForoService = {
  // Obtener todos los posts de un foro
  getPosts: async (foroId: string): Promise<PostForoData[]> => {
    const response = await api.get(`/foros/${foroId}/posts`);
    return response.data.posts;
  },

  // Crear post en un foro
  createPost: async (foroId: string, contenido: string): Promise<PostForoData> => {
    const response = await api.post(`/foros/${foroId}/posts`, { contenido });
    return response.data.post;
  },

  // Eliminar post
  deletePost: async (foroId: string, postId: number): Promise<void> => {
    await api.delete(`/foros/${foroId}/posts/${postId}`);
  },
};

// Made with Bob
