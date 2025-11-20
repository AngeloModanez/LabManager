/**
 * Middleware de tratamento de erros centralizado
 * @module ErrorHandler
 */

/**
 * Middleware para tratamento de erros
 * @param {Error} err - Erro capturado
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro
  console.error(err);

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({
      message: `Erro de validação: ${message}`
    });
  }

  // Erro de duplicação (CNPJ duplicado)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field === 'cnpj' ? 'CNPJ' : field} já está em uso`;
    return res.status(409).json({
      message
    });
  }

  // Erro de ObjectId inválido
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'ID inválido'
    });
  }

  // Erro padrão
  res.status(error.statusCode || 500).json({
    message: error.message || 'Erro interno do servidor'
  });
};

module.exports = errorHandler;