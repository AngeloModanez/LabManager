const Curso = require('../models/Curso');
const mongoose = require('mongoose');

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
    res.status(201).json(curso);
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
        return res.status(400).json({
          message: 'ID da instituição inválido'
        });
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
      .populate('instituicaoId', 'nome')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    res.json(cursos);
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
    ).populate('instituicaoId', 'nome');

    if (!curso) {
      return res.status(404).json({
        message: 'Curso não encontrado'
      });
    }

    res.json(curso);
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
 * Remove um curso por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerCurso = async (req, res, next) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);

    if (!curso) {
      return res.status(404).json({
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
  atualizarCurso,
  removerCurso
};