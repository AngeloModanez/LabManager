const Aula = require('../models/Aula');
const mongoose = require('mongoose');
const { successResponse, successResponseWithPagination, errorResponse } = require('../utils/responseHelper');

/**
 * Controller para operações CRUD de aulas
 * @module AulaController
 */

/**
 * Cria uma nova aula
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarAula = async (req, res, next) => {
  try {
    // Validar ObjectIds
    const { cursoId, disciplinaId, professorId, laboratorioId, blocos } = req.body;
    
    if (cursoId && !mongoose.Types.ObjectId.isValid(cursoId)) {
      return errorResponse(res, 'ID do curso inválido');
    }
    
    if (disciplinaId && !mongoose.Types.ObjectId.isValid(disciplinaId)) {
      return errorResponse(res, 'ID da disciplina inválido');
    }
    
    if (professorId && !mongoose.Types.ObjectId.isValid(professorId)) {
      return errorResponse(res, 'ID do professor inválido');
    }
    
    if (laboratorioId && !mongoose.Types.ObjectId.isValid(laboratorioId)) {
      return errorResponse(res, 'ID do laboratório inválido');
    }

    if (blocos && Array.isArray(blocos)) {
      for (const blocoId of blocos) {
        if (!mongoose.Types.ObjectId.isValid(blocoId)) {
          return errorResponse(res, 'ID de bloco inválido');
        }
      }
    }

    const aula = await Aula.create(req.body);
    successResponse(res, aula, 'Aula criada com sucesso', 201);
  } catch (error) {
    if (error.message.includes('Conflito')) {
      return res.status(409).json({
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Lista todas as aulas com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarAulas = async (req, res, next) => {
  try {
    const { 
      cursoId, 
      disciplinaId, 
      professorId, 
      laboratorioId, 
      diaSemana, 
      semestre,
      page = 1, 
      limit = 20 
    } = req.query;
    
    const filter = {};

    if (cursoId) {
      if (!mongoose.Types.ObjectId.isValid(cursoId)) {
        return res.status(400).json({
          message: 'ID do curso inválido'
        });
      }
      filter.cursoId = cursoId;
    }

    if (disciplinaId) {
      if (!mongoose.Types.ObjectId.isValid(disciplinaId)) {
        return res.status(400).json({
          message: 'ID da disciplina inválido'
        });
      }
      filter.disciplinaId = disciplinaId;
    }

    if (professorId) {
      if (!mongoose.Types.ObjectId.isValid(professorId)) {
        return res.status(400).json({
          message: 'ID do professor inválido'
        });
      }
      filter.professorId = professorId;
    }

    if (laboratorioId) {
      if (!mongoose.Types.ObjectId.isValid(laboratorioId)) {
        return res.status(400).json({
          message: 'ID do laboratório inválido'
        });
      }
      filter.laboratorioId = laboratorioId;
    }

    if (diaSemana) {
      filter.diaSemana = diaSemana;
    }

    if (semestre) {
      filter.semestre = { $regex: semestre, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const aulas = await Aula.find(filter)
      .populate('cursoId', 'nome sigla status')
      .populate('disciplinaId', 'nome status')
      .populate('professorId', 'nome email status')
      .populate('laboratorioId', 'nome numero status')
      .populate('blocos', 'turno inicio fim ordem')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ semestre: -1, diaSemana: 1, dataInicio: 1 });

    const total = await Aula.countDocuments(filter);
    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    };
    
    successResponseWithPagination(res, aulas, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza uma aula por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarAula = async (req, res, next) => {
  try {
    // Validar ObjectIds se fornecidos
    const { cursoId, disciplinaId, professorId, laboratorioId, blocos } = req.body;
    
    if (cursoId && !mongoose.Types.ObjectId.isValid(cursoId)) {
      return res.status(400).json({
        message: 'ID do curso inválido'
      });
    }
    
    if (disciplinaId && !mongoose.Types.ObjectId.isValid(disciplinaId)) {
      return res.status(400).json({
        message: 'ID da disciplina inválido'
      });
    }
    
    if (professorId && !mongoose.Types.ObjectId.isValid(professorId)) {
      return res.status(400).json({
        message: 'ID do professor inválido'
      });
    }
    
    if (laboratorioId && !mongoose.Types.ObjectId.isValid(laboratorioId)) {
      return res.status(400).json({
        message: 'ID do laboratório inválido'
      });
    }

    if (blocos && Array.isArray(blocos)) {
      for (const blocoId of blocos) {
        if (!mongoose.Types.ObjectId.isValid(blocoId)) {
          return res.status(400).json({
            message: 'ID de bloco inválido'
          });
        }
      }
    }

    const aula = await Aula.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!aula) {
      return errorResponse(res, 'Aula não encontrada', 404);
    }

    successResponse(res, aula, 'Aula atualizada com sucesso');
  } catch (error) {
    if (error.message.includes('Conflito')) {
      return res.status(409).json({
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Busca uma aula por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const buscarAulaPorId = async (req, res, next) => {
  try {
    const aula = await Aula.findById(req.params.id)
      .populate('cursoId', 'nome sigla status')
      .populate('disciplinaId', 'nome status')
      .populate('professorId', 'nome email status')
      .populate('laboratorioId', 'nome numero status')
      .populate('blocos', 'turno inicio fim ordem');

    if (!aula) {
      return errorResponse(res, 'Aula não encontrada', 404);
    }

    successResponse(res, aula);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove uma aula por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerAula = async (req, res, next) => {
  try {
    const aula = await Aula.findByIdAndDelete(req.params.id);

    if (!aula) {
      return errorResponse(res, 'Aula não encontrada', 404);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarAula,
  listarAulas,
  buscarAulaPorId,
  atualizarAula,
  removerAula
};