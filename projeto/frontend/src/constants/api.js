/**
 * Configurações da API
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  INSTITUICOES: '/instituicoes',
  CURSOS: '/cursos',
  PROFESSORES: '/professores',
  LABORATORIOS: '/laboratorios',
  DISCIPLINAS: '/disciplinas',
  BLOCOS: '/blocos',
};