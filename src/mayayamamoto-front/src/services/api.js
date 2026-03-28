/**
 * Configuração centralizada da API com detecção de ambiente nativa do Vite.
 */
export const API_URL = import.meta.env.VITE_API_URL || 'https://hfk9lk-3000.csb.app/';

export const endpoints = {
  login: `${API_URL}/auth/login`,
  getUsers: `${API_URL}/users`,
  getDoctors: `${API_URL}/users/doctors`,
  getPatients: `${API_URL}/patients`,
  getPatientDetails: (id) => `${API_URL}/patients/${id}`,
  getSessions: `${API_URL}/sessions`,
  getPatientSessions: (id) => `${API_URL}/sessions/patient/${id}`,
  getPatientPrescriptions: (id) => `${API_URL}/prescriptions/patient/${id}`,
  getPatientLogs: (id) => `${API_URL}/execution-logs/patient/${id}`,
  updatePatient: (id) => `${API_URL}/patients/${id}`,
  deletePatient: (id) => `${API_URL}/patients/${id}`,
  createPrescription: `${API_URL}/prescriptions`,
  updatePrescription: (id) => `${API_URL}/prescriptions/${id}`,
  deletePrescription: (id) => `${API_URL}/prescriptions/${id}`,
  getExercises: `${API_URL}/exercises`,
  uploadVideo: `${API_URL}/youtube/upload`,
};

export default API_URL;
