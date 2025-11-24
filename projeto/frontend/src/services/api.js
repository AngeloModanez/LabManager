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

export default api;