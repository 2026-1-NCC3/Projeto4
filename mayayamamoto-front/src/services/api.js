/**
 * Configuração centralizada da API com detecção de ambiente nativa do Vite.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const endpoints = {
  login: `${API_URL}/auth/login`,
  getUsers: `${API_URL}/users`, // Removido o 'get' para bater com o back-end
  getExercises: `${API_URL}/exercises`, // Removido o 'get' para bater com o back-end
  uploadVideo: `${API_URL}/youtube/upload`,
};

export default API_URL;
