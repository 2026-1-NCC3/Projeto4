/**
 * Configuração centralizada da API com detecção de ambiente nativa do Vite.
 */
const API_URL = import.meta.env.VITE_API_URL || 'https://hfk9lk-3000.csb.app';

export const endpoints = {
  login: `${API_URL}/auth/login`,
  getUsers: `${API_URL}/users`,
  getPatients: `${API_URL}/patients`, // Adicionado
  getExercises: `${API_URL}/exercises`,
  uploadVideo: `${API_URL}/youtube/upload`,
};

export default API_URL;
