const mongoose = require('mongoose');

/**
 * Schema para o modelo de Cursos
 * @typedef {Object} Curso
 * @property {string} nome - Nome do curso
 * @property {string} [sigla] - Sigla do curso
 * @property {ObjectId} instituicaoId - ID da instituição
 * @property {string[]} turnos - Turnos do curso (manhã, tarde, noite)
 * @property {boolean} [status] - Status ativo/inativo do curso
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Cursos
 */
const cursoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  sigla: {
    type: String,
    trim: true,
    maxlength: [10, 'Sigla deve ter no máximo 10 caracteres']
  },
  instituicaoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instituicao',
    required: [true, 'Instituição é obrigatória']
  },
  turnos: {
    type: [String],
    required: [true, 'Pelo menos um turno é obrigatório'],
    enum: {
      values: ['Manhã', 'Tarde', 'Noite'],
      message: 'Turno deve ser: Manhã, Tarde ou Noite'
    },
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Pelo menos um turno deve ser selecionado'
    }
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'cursos'
});

// Índice composto para garantir unicidade do nome dentro da mesma instituição
cursoSchema.index({ nome: 1, instituicaoId: 1 }, { unique: true });

/**
 * Modelo Mongoose para Cursos
 * @class Curso
 */
const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;