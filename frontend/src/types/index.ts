export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'maestro' | 'alumno';
  createdAt?: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  rol: 'maestro' | 'alumno';
}

// --------------------------------------------
// CLASES
// --------------------------------------------

export interface Class {
  id: string;
  nombre_class: string;
  descrip_class?: string;
  color_class?: string;
  teacherId: string;
  teacherName?: string;
  students?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateClassData {
  nombre_class: string;
  descrip_class?: string;
  color_class?: string;
}

// --------------------------------------------
// ENCUESTAS/POLLS
// --------------------------------------------

export interface Poll {
  id: string;
  title: string;
  description?: string;
  classId: string;
  className?: string;
  teacherId: string;
  teacherName?: string;
  questions: Question[];
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  timeLimit?: number; // minutos
  allowMultipleAttempts?: boolean;
  showResultsToStudents?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[]; // Para multiple-choice
  correctAnswer?: string | number; // Opcional, para calificación automática
  points?: number;
  order?: number;
  required?: boolean;
}

export interface CreatePollData {
  title: string;
  description?: string;
  classId: string;
  questions: Omit<Question, 'id'>[];
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  timeLimit?: number;
  allowMultipleAttempts?: boolean;
  showResultsToStudents?: boolean;
}

// --------------------------------------------
// RESPUESTAS DE ESTUDIANTES
// --------------------------------------------

export interface StudentResponse {
  id: string;
  pollId: string;
  studentId: string;
  studentName?: string;
  answers: Answer[];
  submittedAt: Date;
  score?: number;
  maxScore?: number;
  percentage?: number;
  timeSpent?: number; // segundos
  attemptNumber?: number;
}

export interface Answer {
  questionId: string;
  answer: string | number | string[];
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface SubmitResponseData {
  pollId: string;
  answers: Omit<Answer, 'isCorrect' | 'pointsEarned'>[];
  timeSpent?: number;
}

// --------------------------------------------
// ENCUESTAS CON ESTADO (PARA ESTUDIANTES)
// --------------------------------------------

export interface PollWithStatus extends Poll {
  status: 'pending' | 'in-progress' | 'completed' | 'expired';
  studentResponse?: StudentResponse;
  attemptsUsed?: number;
  lastAttemptDate?: Date;
  canRetake?: boolean;
}

// --------------------------------------------
// RESULTADOS Y ANALYTICS
// --------------------------------------------

export interface PollResults {
  pollId: string;
  pollTitle: string;
  totalResponses: number;
  averageScore?: number;
  highestScore?: number;
  lowestScore?: number;
  completionRate?: number;
  questionStats: QuestionStats[];
  responses: StudentResponse[];
}

export interface QuestionStats {
  questionId: string;
  questionText: string;
  questionType: Question['type'];
  totalAnswers: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  averageScore?: number;
  answerDistribution?: AnswerDistribution[];
}

export interface AnswerDistribution {
  answer: string;
  count: number;
  percentage: number;
}

// --------------------------------------------
// NOTIFICACIONES
// --------------------------------------------

export interface Notification {
  id: string;
  userId: string;
  type: 'new-poll' | 'poll-graded' | 'poll-reminder' | 'class-announcement';
  title: string;
  message: string;
  relatedId?: string; // pollId, classId, etc.
  isRead: boolean;
  createdAt: Date;
}

// --------------------------------------------
// FOROS
// --------------------------------------------

export interface ForumPost {
  id: string;
  classId: string;
  authorId: string;
  authorName: string;
  authorRole: 'maestro' | 'alumno';
  title: string;
  content: string;
  replies?: ForumReply[];
  likes?: number;
  isPinned?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: 'maestro' | 'alumno';
  content: string;
  likes?: number;
  createdAt: Date;
  updatedAt?: Date;
}

// --------------------------------------------
// AVISOS/ANNOUNCEMENTS
// --------------------------------------------

export interface Announcement {
  id: string;
  classId: string;
  teacherId: string;
  teacherName: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// --------------------------------------------
// SOCKET.IO EVENTS
// --------------------------------------------

export interface SocketEvents {
  // Eventos de encuestas
  'poll:created': (poll: Poll) => void;
  'poll:updated': (poll: Poll) => void;
  'poll:deleted': (pollId: string) => void;
  'poll:response': (response: StudentResponse) => void;
  
  // Eventos de notificaciones
  'notification:new': (notification: Notification) => void;
  
  // Eventos de foros
  'forum:new-post': (post: ForumPost) => void;
  'forum:new-reply': (reply: ForumReply) => void;
  
  // Eventos de avisos
  'announcement:new': (announcement: Announcement) => void;
}

// --------------------------------------------
// API RESPONSES
// --------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// --------------------------------------------
// FILTROS Y BÚSQUEDA
// --------------------------------------------

export interface PollFilters {
  classId?: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}

export interface StudentFilters {
  classId?: string;
  searchTerm?: string;
}

// --------------------------------------------
// CONFIGURACIÓN
// --------------------------------------------

export interface AppConfig {
  apiUrl: string;
  socketUrl: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  pollTimeoutWarning: number; // minutos antes de mostrar advertencia
}

// Made with Bob
