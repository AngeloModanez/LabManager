const Bloco = require('../models/Bloco');

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
    res.status(201).json(bloco);
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

    res.json(blocos);
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
      return res.status(404).json({
        message: 'Bloco não encontrado'
      });
    }

    res.json(bloco);
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
      return res.status(404).json({
        message: 'Bloco não encontrado'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarBloco,
  listarBlocos,
  atualizarBloco,
  removerBloco
};