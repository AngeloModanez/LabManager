const Bloco = require('../models/Bloco');
const { successResponse, successResponseWithPagination, errorResponse } = require('../utils/responseHelper');

/**
 * Controller para operações CRUD de blocos de horário
 * @module BlocoController
 */

/**
 * Cria um novo bloco
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarBloco = async (req, res, next) => {
  try {
    const bloco = await Bloco.create(req.body);
    successResponse(res, bloco, 'Bloco criado com sucesso', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todos os blocos com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarBlocos = async (req, res, next) => {
  try {
    const { turno, dia_da_semana, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (turno) {
      filter.turno = turno;
    }

    if (dia_da_semana) {
      filter.dia_da_semana = dia_da_semana;
    }

    if (status !== undefined) {
      filter.status = status === 'true';
    }

    const skip = (page - 1) * limit;
    const blocos = await Bloco.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ turno: 1, dia_da_semana: 1, ordem: 1 });

    const total = await Bloco.countDocuments(filter);
    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    };
    
    successResponseWithPagination(res, blocos, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza um bloco por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarBloco = async (req, res, next) => {
  try {
    const bloco = await Bloco.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bloco) {
      return errorResponse(res, 'Bloco não encontrado', 404);
    }

    successResponse(res, bloco, 'Bloco atualizado com sucesso');
  } catch (error) {
    next(error);
  }
};

/**
 * Busca um bloco por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const buscarBlocoPorId = async (req, res, next) => {
  try {
    const bloco = await Bloco.findById(req.params.id);

    if (!bloco) {
      return errorResponse(res, 'Bloco não encontrado', 404);
    }

    successResponse(res, bloco);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove um bloco por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerBloco = async (req, res, next) => {
  try {
    const bloco = await Bloco.findByIdAndDelete(req.params.id);

    if (!bloco) {
      return errorResponse(res, 'Bloco não encontrado', 404);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarBloco,
  listarBlocos,
  buscarBlocoPorId,
  atualizarBloco,
  removerBloco
};