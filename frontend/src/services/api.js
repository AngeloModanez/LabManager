import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../constants/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const instituicoesService = {
  listar: (params = {}) => api.get(API_ENDPOINTS.INSTITUICOES, { params }),
  criar: (data) => api.post(API_ENDPOINTS.INSTITUICOES, data),
  atualizar: (id, data) => api.put(`${API_ENDPOINTS.INSTITUICOES}/${id}`, data),
  remover: (id) => api.delete(`${API_ENDPOINTS.INSTITUICOES}/${id}`),
  buscarPorId: (id) => api.get(`${API_ENDPOINTS.INSTITUICOES}/${id}`),
};

export const cursosService = {
  listar: (params = {}) => api.get(API_ENDPOINTS.CURSOS, { params }),
  criar: (data) => api.post(API_ENDPOINTS.CURSOS, data),
  atualizar: (id, data) => api.put(`${API_ENDPOINTS.CURSOS}/${id}`, data),
  remover: (id) => api.delete(`${API_ENDPOINTS.CURSOS}/${id}`),
  buscarPorId: (id) => api.get(`${API_ENDPOINTS.CURSOS}/${id}`),
};

export const professoresService = {
  listar: (params = {}) => api.get(API_ENDPOINTS.PROFESSORES, { params }),
  criar: (data) => api.post(API_ENDPOINTS.PROFESSORES, data),
  atualizar: (id, data) => api.put(`${API_ENDPOINTS.PROFESSORES}/${id}`, data),
  remover: (id) => api.delete(`${API_ENDPOINTS.PROFESSORES}/${id}`),
  buscarPorId: (id) => api.get(`${API_ENDPOINTS.PROFESSORES}/${id}`),
};

export const disciplinasService = {
  listar: (params = {}) => api.get(API_ENDPOINTS.DISCIPLINAS, { params }),
  criar: (data) => api.post(API_ENDPOINTS.DISCIPLINAS, data),
  atualizar: (id, data) => api.put(`${API_ENDPOINTS.DISCIPLINAS}/${id}`, data),
  remover: (id) => api.delete(`${API_ENDPOINTS.DISCIPLINAS}/${id}`),
  buscarPorId: (id) => api.get(`${API_ENDPOINTS.DISCIPLINAS}/${id}`),
};

export const laboratoriosService = {
  listar: (params = {}) => api.get(API_ENDPOINTS.LABORATORIOS, { params }),
  criar: (data) => api.post(API_ENDPOINTS.LABORATORIOS, data),
  atualizar: (id, data) => api.put(`${API_ENDPOINTS.LABORATORIOS}/${id}`, data),
  remover: (id) => api.delete(`${API_ENDPOINTS.LABORATORIOS}/${id}`),
  buscarPorId: (id) => api.get(`${API_ENDPOINTS.LABORATORIOS}/${id}`),
};

export const blocosService = {
  listar: (params = {}) => api.get(API_ENDPOINTS.BLOCOS, { params }),
  criar: (data) => api.post(API_ENDPOINTS.BLOCOS, data),
  atualizar: (id, data) => api.put(`${API_ENDPOINTS.BLOCOS}/${id}`, data),
  remover: (id) => api.delete(`${API_ENDPOINTS.BLOCOS}/${id}`),
  buscarPorId: (id) => api.get(`${API_ENDPOINTS.BLOCOS}/${id}`),
};

export default api;