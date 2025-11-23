const Instituicao = require('../models/Instituicao');

/**
 * Controller para operações CRUD de instituições
 * @module InstituicaoController
 */

/**
 * Cria uma nova instituição
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarInstituicao = async (req, res, next) => {
  try {
    const instituicao = await Instituicao.create(req.body);
    res.status(201).json({
      success: true,
      data: instituicao,
      message: 'Instituição criada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todas as instituições com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarInstituicoes = async (req, res, next) => {
  try {
    const { ativo, nome, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (ativo !== undefined) {
      filter.ativo = ativo === 'true';
    }

    if (nome) {
      filter.nome = { $regex: nome, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const instituicoes = await Instituicao.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    const total = await Instituicao.countDocuments(filter);

    res.json({
      success: true,
      data: instituicoes,
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
 * Atualiza uma instituição por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarInstituicao = async (req, res, next) => {
  try {
    const instituicao = await Instituicao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!instituicao) {
      return res.status(404).json({
        success: false,
        message: 'Instituição não encontrada'
      });
    }

    res.json({
      success: true,
      data: instituicao,
      message: 'Instituição atualizada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Busca uma instituição por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const buscarInstituicaoPorId = async (req, res, next) => {
  try {
    const instituicao = await Instituicao.findById(req.params.id);

    if (!instituicao) {
      return res.status(404).json({
        success: false,
        message: 'Instituição não encontrada'
      });
    }

    res.json({
      success: true,
      data: instituicao
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualização parcial de uma instituição por ID (PATCH)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarInstituicaoParcial = async (req, res, next) => {
  try {
    const instituicao = await Instituicao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!instituicao) {
      return res.status(404).json({
        success: false,
        message: 'Instituição não encontrada'
      });
    }

    res.json({
      success: true,
      data: instituicao,
      message: 'Instituição atualizada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove uma instituição por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerInstituicao = async (req, res, next) => {
  try {
    // Verificar se há cursos vinculados
    const Curso = require('../models/Curso');
    const cursosVinculados = await Curso.countDocuments({ instituicaoId: req.params.id });
    
    if (cursosVinculados > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir instituição com cursos vinculados'
      });
    }

    const instituicao = await Instituicao.findByIdAndDelete(req.params.id);

    if (!instituicao) {
      return res.status(404).json({
        success: false,
        message: 'Instituição não encontrada'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarInstituicao,
  listarInstituicoes,
  buscarInstituicaoPorId,
  atualizarInstituicao,
  atualizarInstituicaoParcial,
  removerInstituicao
};