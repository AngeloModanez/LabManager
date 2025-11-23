/**
 * Exporta todos os modelos do sistema
 * @module Models
 */

const Instituicao = require('./Instituicao');
const Curso = require('./Curso');
const Bloco = require('./Bloco');
const Professor = require('./Professor');
const Laboratorio = require('./Laboratorio');
const Disciplina = require('./Disciplina');

module.exports = {
  Instituicao,
  Curso,
  Bloco,
  Professor,
  Laboratorio,
  Disciplina,
};
