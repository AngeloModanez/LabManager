/**
 * Utilitários para padronização de respostas da API
 * @module ResponseHelper
 */

/**
 * Resposta de sucesso padronizada
 * @param {Object} res - Response object
 * @param {*} data - Dados a serem retornados
 * @param {string} message - Mensagem de sucesso
 * @param {number} statusCode - Código de status HTTP
 */
const successResponse = (res, data, message = 'Operação realizada com sucesso', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Resposta de sucesso com paginação
 * @param {Object} res - Response object
 * @param {*} data - Dados a serem retornados
 * @param {Object} pagination - Informações de paginação
 * @param {string} message - Mensagem de sucesso
 */
const successResponseWithPagination = (res, data, pagination, message = 'Dados recuperados com sucesso') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination
  });
};

/**
 * Resposta de erro padronizada
 * @param {Object} res - Response object
 * @param {string} message - Mensagem de erro
 * @param {number} statusCode - Código de status HTTP
 * @param {*} details - Detalhes adicionais do erro
 */
const errorResponse = (res, message, statusCode = 400, details = null) => {
  const response = {
    success: false,
    message
  };
  
  if (details) {
    response.details = details;
  }
  
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  successResponseWithPagination,
  errorResponse
};