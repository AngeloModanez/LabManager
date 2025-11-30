import axios from 'axios';

/**
 * Configuração da API para mobile
 */
const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Tempo limite de conexão excedido';
    } else if (!error.response) {
      error.message = 'Erro de conexão com o servidor';
    } else {
      const status = error.response.status;
      switch (status) {
        case 404:
          error.message = 'Recurso não encontrado';
          break;
        case 409:
          error.message = error.response.data?.message || 'Conflito de dados';
          break;
        case 500:
          error.message = 'Erro interno do servidor';
          break;
        default:
          error.message = error.response.data?.message || 'Erro desconhecido';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Serviços para operações com instituições
 */
export const instituicoesService = {
  listar: (params = {}) => api.get('/instituicoes', { params }),
  criar: (data) => api.post('/instituicoes', data),
  atualizar: (id, data) => api.put(`/instituicoes/${id}`, data),
  remover: (id) => api.delete(`/instituicoes/${id}`),
  buscarPorId: (id) => api.get(`/instituicoes/${id}`),
};

/**
 * Serviços para operações com cursos
 */
export const cursosService = {
  listar: (params = {}) => api.get('/cursos', { params }),
  criar: (data) => api.post('/cursos', data),
  atualizar: (id, data) => api.put(`/cursos/${id}`, data),
  remover: (id) => api.delete(`/cursos/${id}`),
  buscarPorId: (id) => api.get(`/cursos/${id}`),
};

/**
 * Serviços para operações com professores
 */
export const professoresService = {
  listar: (params = {}) => api.get('/professores', { params }),
  criar: (data) => api.post('/professores', data),
  atualizar: (id, data) => api.put(`/professores/${id}`, data),
  remover: (id) => api.delete(`/professores/${id}`),
  buscarPorId: (id) => api.get(`/professores/${id}`),
};

/**
 * Serviços para operações com disciplinas
 */
export const disciplinasService = {
  listar: (params = {}) => api.get('/disciplinas', { params }),
  criar: (data) => api.post('/disciplinas', data),
  atualizar: (id, data) => api.put(`/disciplinas/${id}`, data),
  remover: (id) => api.delete(`/disciplinas/${id}`),
  buscarPorId: (id) => api.get(`/disciplinas/${id}`),
};

/**
 * Serviços para operações com laboratórios
 */
export const laboratoriosService = {
  listar: (params = {}) => api.get('/laboratorios', { params }),
  criar: (data) => api.post('/laboratorios', data),
  atualizar: (id, data) => api.put(`/laboratorios/${id}`, data),
  remover: (id) => api.delete(`/laboratorios/${id}`),
  buscarPorId: (id) => api.get(`/laboratorios/${id}`),
};

/**
 * Serviços para operações com blocos
 */
export const blocosService = {
  listar: (params = {}) => api.get('/blocos', { params }),
  criar: (data) => api.post('/blocos', data),
  atualizar: (id, data) => api.put(`/blocos/${id}`, data),
  remover: (id) => api.delete(`/blocos/${id}`),
  buscarPorId: (id) => api.get(`/blocos/${id}`),
};

/**
 * Serviços para operações com aulas
 */
export const aulasService = {
  listar: (params = {}) => api.get('/aulas', { params }),
  criar: (data) => api.post('/aulas', data),
  atualizar: (id, data) => api.put(`/aulas/${id}`, data),
  remover: (id) => api.delete(`/aulas/${id}`),
  buscarPorId: (id) => api.get(`/aulas/${id}`),
};

export default api;