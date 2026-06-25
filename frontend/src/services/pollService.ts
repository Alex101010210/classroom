import api from './api';
import { Poll, SubmitResponseData, StudentResponse, PollWithStatus } from '../types';

export const pollService = {
  // Obtener una encuesta por ID
  getPollById: async (pollId: string): Promise<Poll> => {
    const response = await api.get(`/polls/${pollId}`);
    return response.data.data;
  },

  // Obtener todas las encuestas de una clase (para el alumno)
  getPollsByClass: async (classId: string): Promise<PollWithStatus[]> => {
    const response = await api.get(`/polls/class/${classId}`);
    return response.data.polls || response.data.data || [];
  },

  // Enviar respuestas de una encuesta
  submitResponse: async (data: SubmitResponseData): Promise<StudentResponse> => {
    const response = await api.post(`/polls/${data.pollId}/responses`, data);
    return response.data.data;
  },

  // Obtener resultado de una encuesta ya respondida por el alumno
  getMyResult: async (pollId: string): Promise<StudentResponse> => {
    const response = await api.get(`/polls/${pollId}/my-result`);
    return response.data.data;
  },

  // Obtener todas las encuestas (para el maestro)
  getTeacherPolls: async (): Promise<Poll[]> => {
    const response = await api.get('/polls');
    return response.data.polls || response.data.data || [];
  },
};

// Made with Bob
