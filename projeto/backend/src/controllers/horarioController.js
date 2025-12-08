const Aula = require('../models/Aula');
const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * Controller para consulta de horários
 * @module HorarioController
 */

/**
 * Consulta horários com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const consultarHorarios = async (req, res, next) => {
  try {
    const { 
      laboratorioId, 
      cursoId, 
      disciplinaId, 
      professorId,
      semestre,
      diaSemana
    } = req.query;
    
    const filter = {};
    const dataAtual = new Date();

    // Validar e aplicar filtros
    if (laboratorioId) {
      if (!mongoose.Types.ObjectId.isValid(laboratorioId)) {
        return errorResponse(res, 'ID do laboratório inválido', 400);
      }
      filter.laboratorioId = laboratorioId;
    }

    if (cursoId) {
      if (!mongoose.Types.ObjectId.isValid(cursoId)) {
        return errorResponse(res, 'ID do curso inválido', 400);
      }
      filter.cursoId = cursoId;
    }

    if (disciplinaId) {
      if (!mongoose.Types.ObjectId.isValid(disciplinaId)) {
        return errorResponse(res, 'ID da disciplina inválido', 400);
      }
      filter.disciplinaId = disciplinaId;
    }

    if (professorId) {
      if (!mongoose.Types.ObjectId.isValid(professorId)) {
        return errorResponse(res, 'ID do professor inválido', 400);
      }
      filter.professorId = professorId;
    }

    if (semestre) {
      filter.semestre = semestre;
    }

    if (diaSemana) {
      filter.diaSemana = diaSemana;
    }

    // Buscar aulas válidas (considerando dataInicio e dataFim)
    // Comentado para mostrar todas as aulas independente da data
    // filter.dataInicio = { $lte: dataAtual };
    // filter.dataFim = { $gte: dataAtual };

    const aulas = await Aula.find(filter)
      .populate('cursoId', 'nome sigla status')
      .populate('disciplinaId', 'nome status')
      .populate('professorId', 'nome status')
      .populate('laboratorioId', 'nome numero status')
      .populate({
        path: 'blocos',
        select: 'turno inicio fim ordem dia_da_semana status'
      })
      .sort({ diaSemana: 1 });

    // Organizar dados por dia da semana e bloco
    const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const turnos = ['Manhã', 'Tarde', 'Noite'];
    
    const horarios = {
      Manhã: {},
      Tarde: {},
      Noite: {}
    };

    // Inicializar estrutura
    turnos.forEach(turno => {
      diasSemana.forEach(dia => {
        horarios[turno][dia] = [];
      });
    });

    // Preencher com as aulas
    aulas.forEach(aula => {
      if (!aula.blocos || aula.blocos.length === 0) return;
      
      aula.blocos.forEach(bloco => {
        if (!bloco || !bloco.turno) return;
        
        const turno = bloco.turno;
        const dia = aula.diaSemana;
        
        if (!horarios[turno] || !horarios[turno][dia]) return;
        
        horarios[turno][dia].push({
          blocoId: bloco._id,
          blocoInicio: bloco.inicio,
          blocoFim: bloco.fim,
          blocoOrdem: bloco.ordem,
          disciplina: aula.disciplinaId?.nome || 'N/A',
          professor: aula.professorId?.nome || 'N/A',
          curso: aula.cursoId?.nome || 'N/A',
          cursoSigla: aula.cursoId?.sigla || '',
          laboratorio: aula.laboratorioId?.nome || 'N/A',
          laboratorioNumero: aula.laboratorioId?.numero || '',
          semestre: aula.semestre,
          aulaId: aula._id
        });
      });
    });

    // Ordenar blocos por ordem
    turnos.forEach(turno => {
      diasSemana.forEach(dia => {
        horarios[turno][dia].sort((a, b) => a.blocoOrdem - b.blocoOrdem);
      });
    });

    successResponse(res, horarios, 'Horários consultados com sucesso');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  consultarHorarios
};
