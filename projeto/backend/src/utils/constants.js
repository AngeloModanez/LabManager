/**
 * Constantes da aplicação
 * @module Constants
 */

/**
 * Status padrão para entidades
 */
const STATUS = {
  ATIVO: true,
  INATIVO: false
};

/**
 * Turnos disponíveis
 */
const TURNOS = {
  MANHA: 'manhã',
  TARDE: 'tarde',
  NOITE: 'noite'
};

/**
 * Dias da semana
 */
const DIAS_SEMANA = {
  SEGUNDA: 'segunda',
  TERCA: 'terça',
  QUARTA: 'quarta',
  QUINTA: 'quinta',
  SEXTA: 'sexta',
  SABADO: 'sábado'
};

/**
 * Códigos de status HTTP mais utilizados
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

/**
 * Mensagens padrão
 */
const MESSAGES = {
  SUCCESS: {
    CREATED: 'Criado com sucesso',
    UPDATED: 'Atualizado com sucesso',
    DELETED: 'Removido com sucesso',
    FOUND: 'Dados recuperados com sucesso'
  },
  ERROR: {
    NOT_FOUND: 'não encontrado',
    VALIDATION: 'Erro de validação',
    DUPLICATE: 'já está em uso',
    INVALID_ID: 'ID inválido',
    INTERNAL: 'Erro interno do servidor'
  }
};

/**
 * Configurações de paginação
 */
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

module.exports = {
  STATUS,
  TURNOS,
  DIAS_SEMANA,
  HTTP_STATUS,
  MESSAGES,
  PAGINATION
};