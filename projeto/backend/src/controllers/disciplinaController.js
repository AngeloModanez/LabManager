const Disciplina = require('../models/Disciplina');
const mongoose = require('mongoose');
const { successResponse, successResponseWithPagination, errorResponse } = require('../utils/responseHelper');

/**
 * Controller para operações CRUD de disciplinas
 * @module DisciplinaController
 */

/**
 * Cria uma nova disciplina
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarDisciplina = async (req, res, next) => {
  try {
    // Validar ObjectIds
    const { cursoId, professorId } = req.body;
    
    if (cursoId && !mongoose.Types.ObjectId.isValid(cursoId)) {
      return errorResponse(res, 'ID do curso inválido');
    }
    
    if (professorId && !mongoose.Types.ObjectId.isValid(professorId)) {
      return errorResponse(res, 'ID do professor inválido');
    }

    const disciplina = await Disciplina.create(req.body);
    successResponse(res, disciplina, 'Disciplina criada com sucesso', 201);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Já existe uma disciplina com este nome no curso selecionado'
      });
    }
    next(error);
  }
};

/**
 * Lista todas as disciplinas com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarDisciplinas = async (req, res, next) => {
  try {
    const { cursoId, professorId, status, nome, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (cursoId) {
      if (!mongoose.Types.ObjectId.isValid(cursoId)) {
        return res.status(400).json({
          message: 'ID do curso inválido'
        });
      }
      filter.cursoId = cursoId;
    }

    if (professorId) {
      if (!mongoose.Types.ObjectId.isValid(professorId)) {
        return res.status(400).json({
          message: 'ID do professor inválido'
        });
      }
      filter.professorId = professorId;
    }

    if (status !== undefined) {
      filter.status = status === 'true';
    }

    if (nome) {
      filter.nome = { $regex: nome, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const disciplinas = await Disciplina.find(filter)
      .populate('cursoId', 'nome sigla status')
      .populate('professorId', 'nome email status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    const total = await Disciplina.countDocuments(filter);
    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    };
    
    successResponseWithPagination(res, disciplinas, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza uma disciplina por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarDisciplina = async (req, res, next) => {
  try {
    // Validar ObjectIds se fornecidos
    const { cursoId, professorId } = req.body;
    
    if (cursoId && !mongoose.Types.ObjectId.isValid(cursoId)) {
      return res.status(400).json({
        message: 'ID do curso inválido'
      });
    }
    
    if (professorId && !mongoose.Types.ObjectId.isValid(professorId)) {
      return res.status(400).json({
        message: 'ID do professor inválido'
      });
    }

    const disciplina = await Disciplina.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!disciplina) {
      return errorResponse(res, 'Disciplina não encontrada', 404);
    }

    successResponse(res, disciplina, 'Disciplina atualizada com sucesso');
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Já existe uma disciplina com este nome no curso selecionado'
      });
    }
    next(error);
  }
};

/**
 * Busca uma disciplina por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const buscarDisciplinaPorId = async (req, res, next) => {
  try {
    const disciplina = await Disciplina.findById(req.params.id)
      .populate('cursoId', 'nome sigla status')
      .populate('professorId', 'nome email status');

    if (!disciplina) {
      return errorResponse(res, 'Disciplina não encontrada', 404);
    }

    successResponse(res, disciplina);
  } catch (error) {
    next(error);
  }
};



/**
 * Remove uma disciplina por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerDisciplina = async (req, res, next) => {
  try {
    // Verificar se há aulas vinculadas
    const Aula = require('../models/Aula');
    const aulasVinculadas = await Aula.countDocuments({ disciplinaId: req.params.id });
    
    if (aulasVinculadas > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir disciplina com aulas vinculadas'
      });
    }

    const disciplina = await Disciplina.findByIdAndDelete(req.params.id);

    if (!disciplina) {
      return errorResponse(res, 'Disciplina não encontrada', 404);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarDisciplina,
  listarDisciplinas,
  buscarDisciplinaPorId,
  atualizarDisciplina,
  removerDisciplina
};