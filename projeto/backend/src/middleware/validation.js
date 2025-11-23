const mongoose = require('mongoose');
const { errorResponse } = require('../utils/responseHelper');

/**
 * Middleware de validação centralizado
 * @module ValidationMiddleware
 */

/**
 * Valida se o ID é um ObjectId válido do MongoDB
 * @param {string} paramName - Nome do parâmetro a ser validado
 * @returns {Function} Middleware function
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, `${paramName} inválido`, 400, { field: paramName, value: id });
    }
    
    next();
  };
};

/**
 * Valida ObjectIds no body da requisição
 * @param {string[]} fields - Campos a serem validados
 * @returns {Function} Middleware function
 */
const validateObjectIdsInBody = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      const value = req.body[field];
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        return errorResponse(res, `${field} inválido`, 400, { field, value });
      }
    }
    next();
  };
};

/**
 * Valida campos obrigatórios no body da requisição
 * @param {string[]} requiredFields - Array com nomes dos campos obrigatórios
 * @returns {Function} Middleware function
 */
const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios ausentes',
        details: { missingFields }
      });
    }
    
    next();
  };
};

/**
 * Valida parâmetros de paginação
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({
      success: false,
      message: 'Página deve ser um número maior que 0'
    });
  }
  
  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Limit deve ser um número entre 1 e 100'
    });
  }
  
  next();
};

module.exports = {
  validateObjectId,
  validateObjectIdsInBody,
  validateRequiredFields,
  validatePagination
};