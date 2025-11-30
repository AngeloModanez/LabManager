const Laboratorio = require('../models/Laboratorio');
const { successResponse, successResponseWithPagination, errorResponse } = require('../utils/responseHelper');

/**
 * Controller para operações CRUD de laboratórios
 * @module LaboratorioController
 */

/**
 * Cria um novo laboratório
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarLaboratorio = async (req, res, next) => {
  try {
    const laboratorio = await Laboratorio.create(req.body);
    successResponse(res, laboratorio, 'Laboratório criado com sucesso', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todos os laboratórios com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarLaboratorios = async (req, res, next) => {
  try {
    const { blocoId, status, nome, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (blocoId) {
      filter.blocoId = blocoId;
    }

    if (status !== undefined) {
      filter.status = status === 'true';
    }

    if (nome) {
      filter.nome = { $regex: nome, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const laboratorios = await Laboratorio.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    const total = await Laboratorio.countDocuments(filter);
    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    };
    
    successResponseWithPagination(res, laboratorios, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza um laboratório por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarLaboratorio = async (req, res, next) => {
  try {
    const laboratorio = await Laboratorio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!laboratorio) {
      return errorResponse(res, 'Laboratório não encontrado', 404);
    }

    successResponse(res, laboratorio, 'Laboratório atualizado com sucesso');
  } catch (error) {
    next(error);
  }
};

/**
 * Busca um laboratório por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const buscarLaboratorioPorId = async (req, res, next) => {
  try {
    const laboratorio = await Laboratorio.findById(req.params.id);

    if (!laboratorio) {
      return errorResponse(res, 'Laboratório não encontrado', 404);
    }

    successResponse(res, laboratorio);
  } catch (error) {
    next(error);
  }
};



/**
 * Remove um laboratório por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerLaboratorio = async (req, res, next) => {
  try {
    const laboratorio = await Laboratorio.findByIdAndDelete(req.params.id);

    if (!laboratorio) {
      return errorResponse(res, 'Laboratório não encontrado', 404);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarLaboratorio,
  listarLaboratorios,
  buscarLaboratorioPorId,
  atualizarLaboratorio,
  removerLaboratorio
};