const Professor = require('../models/Professor');

/**
 * Controller para operações CRUD de professores
 * @module ProfessorController
 */

/**
 * Cria um novo professor
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarProfessor = async (req, res, next) => {
  try {
    const professor = await Professor.create(req.body);
    res.status(201).json({
      success: true,
      data: professor,
      message: 'Professor criado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todos os professores com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarProfessores = async (req, res, next) => {
  try {
    const { status, nome, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status !== undefined) {
      filter.status = status === 'true';
    }

    if (nome) {
      filter.nome = { $regex: nome, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const professores = await Professor.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    const total = await Professor.countDocuments(filter);

    res.json({
      success: true,
      data: professores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza um professor por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarProfessor = async (req, res, next) => {
  try {
    const professor = await Professor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: 'Professor não encontrado'
      });
    }

    res.json({
      success: true,
      data: professor,
      message: 'Professor atualizado com sucesso'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Email já está em uso por outro professor'
      });
    }
    next(error);
  }
};

/**
 * Busca um professor por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const buscarProfessorPorId = async (req, res, next) => {
  try {
    const professor = await Professor.findById(req.params.id);

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: 'Professor não encontrado'
      });
    }

    res.json({
      success: true,
      data: professor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualização parcial de um professor por ID (PATCH)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarProfessorParcial = async (req, res, next) => {
  try {
    const professor = await Professor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: 'Professor não encontrado'
      });
    }

    res.json({
      success: true,
      data: professor,
      message: 'Professor atualizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove um professor por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerProfessor = async (req, res, next) => {
  try {
    // Verificar se há disciplinas vinculadas
    const Disciplina = require('../models/Disciplina');
    const disciplinasVinculadas = await Disciplina.countDocuments({ professorId: req.params.id });
    
    if (disciplinasVinculadas > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir professor com disciplinas vinculadas'
      });
    }

    const professor = await Professor.findByIdAndDelete(req.params.id);

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: 'Professor não encontrado'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarProfessor,
  listarProfessores,
  buscarProfessorPorId,
  atualizarProfessor,
  atualizarProfessorParcial,
  removerProfessor
};