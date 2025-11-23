const Disciplina = require('../models/Disciplina');
const mongoose = require('mongoose');

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
    
    if (!mongoose.Types.ObjectId.isValid(cursoId)) {
      return res.status(400).json({
        message: 'ID do curso inválido'
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(professorId)) {
      return res.status(400).json({
        message: 'ID do professor inválido'
      });
    }

    const disciplina = await Disciplina.create(req.body);
    res.status(201).json(disciplina);
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
      .populate('cursoId', 'nome codigo')
      .populate('professorId', 'nome email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    res.json(disciplinas);
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
      return res.status(404).json({
        message: 'Disciplina não encontrada'
      });
    }

    res.json(disciplina);
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
 * Remove uma disciplina por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerDisciplina = async (req, res, next) => {
  try {
    const disciplina = await Disciplina.findByIdAndDelete(req.params.id);

    if (!disciplina) {
      return res.status(404).json({
        message: 'Disciplina não encontrada'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarDisciplina,
  listarDisciplinas,
  atualizarDisciplina,
  removerDisciplina
};