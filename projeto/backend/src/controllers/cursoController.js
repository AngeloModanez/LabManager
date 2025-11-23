const Curso = require('../models/Curso');
const mongoose = require('mongoose');
const { successResponse, successResponseWithPagination, notFoundResponse, errorResponse } = require('../utils/responseHelper');

/**
 * Controller para operações CRUD de cursos
 * @module CursoController
 */

/**
 * Cria um novo curso
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarCurso = async (req, res, next) => {
  try {
    const curso = await Curso.create(req.body);
    res.status(201).json({
      success: true,
      data: curso,
      message: 'Curso criado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todos os cursos com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarCursos = async (req, res, next) => {
  try {
    const { instituicaoId, nome, ativo, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (instituicaoId) {
      if (!mongoose.Types.ObjectId.isValid(instituicaoId)) {
        return errorResponse(res, 'ID da instituição inválido');
      }
      filter.instituicaoId = instituicaoId;
    }

    if (nome) {
      filter.nome = { $regex: nome, $options: 'i' };
    }

    if (ativo !== undefined) {
      filter.ativo = ativo === 'true';
    }

    const skip = (page - 1) * limit;
    const cursos = await Curso.find(filter)
      .populate('instituicaoId', 'nome sigla')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    const total = await Curso.countDocuments(filter);

    res.json({
      success: true,
      data: cursos,
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
 * Atualiza um curso por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarCurso = async (req, res, next) => {
  try {
    const curso = await Curso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instituicaoId', 'nome sigla');

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso não encontrado'
      });
    }

    res.json({
      success: true,
      data: curso,
      message: 'Curso atualizado com sucesso'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Já existe um curso com este nome nesta instituição'
      });
    }
    next(error);
  }
};

/**
 * Busca um curso por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const buscarCursoPorId = async (req, res, next) => {
  try {
    const curso = await Curso.findById(req.params.id)
      .populate('instituicaoId', 'nome sigla');

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso não encontrado'
      });
    }

    res.json({
      success: true,
      data: curso
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualização parcial de um curso por ID (PATCH)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarCursoParcial = async (req, res, next) => {
  try {
    const curso = await Curso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instituicaoId', 'nome sigla');

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso não encontrado'
      });
    }

    res.json({
      success: true,
      data: curso,
      message: 'Curso atualizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove um curso por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerCurso = async (req, res, next) => {
  try {
    // Verificar se há disciplinas vinculadas
    const Disciplina = require('../models/Disciplina');
    const disciplinasVinculadas = await Disciplina.countDocuments({ cursoId: req.params.id });
    
    if (disciplinasVinculadas > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir curso com disciplinas vinculadas'
      });
    }

    const curso = await Curso.findByIdAndDelete(req.params.id);

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso não encontrado'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarCurso,
  listarCursos,
  buscarCursoPorId,
  atualizarCurso,
  atualizarCursoParcial,
  removerCurso
};