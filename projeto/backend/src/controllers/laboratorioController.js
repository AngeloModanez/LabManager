const Laboratorio = require('../models/Laboratorio');

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
    res.status(201).json(laboratorio);
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

    res.json(laboratorios);
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
      return res.status(404).json({
        message: 'Laboratório não encontrado'
      });
    }

    res.json(laboratorio);
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
      return res.status(404).json({
        success: false,
        message: 'Laboratório não encontrado'
      });
    }

    res.json({
      success: true,
      data: laboratorio
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualização parcial de um laboratório por ID (PATCH)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarLaboratorioParcial = async (req, res, next) => {
  try {
    const laboratorio = await Laboratorio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!laboratorio) {
      return res.status(404).json({
        success: false,
        message: 'Laboratório não encontrado'
      });
    }

    res.json({
      success: true,
      data: laboratorio,
      message: 'Laboratório atualizado com sucesso'
    });
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
      return res.status(404).json({
        success: false,
        message: 'Laboratório não encontrado'
      });
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
  atualizarLaboratorioParcial,
  removerLaboratorio
};