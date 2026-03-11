/**
 * Configuração centralizada da API com detecção de ambiente nativa do Vite.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const endpoints = {
  login: `${API_URL}/auth/login`,
  getUsers: `${API_URL}/getUsers`,
  getExercises: `${API_URL}/getExercises`,
  uploadVideo: `${API_URL}/youtube/upload`,
};

export default API_URL;
