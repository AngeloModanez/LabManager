const mongoose = require('mongoose');

/**
 * Schema para o modelo de Disciplinas
 * @typedef {Object} Disciplina
 * @property {string} nome - Nome da disciplina
 * @property {ObjectId} cursoId - ID do curso
 * @property {number} cargaHoraria - Carga horária da disciplina
 * @property {ObjectId} professorId - ID do professor responsável
 * @property {boolean} status - Status ativo/inativo da disciplina
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Disciplinas
 */
const disciplinaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [3, 'Nome deve ter no mínimo 3 caracteres'],
    validate: {
      validator: function(v) {
        return !/^\d+$/.test(v) && !/^[^a-zA-ZÀ-ÿ\s]+$/.test(v);
      },
      message: 'Nome não pode conter apenas números ou caracteres especiais'
    }
  },
  cursoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'Curso é obrigatório']
  },
  cargaHoraria: {
    type: Number,
    required: [true, 'Carga horária é obrigatória'],
    min: [1, 'Carga horária deve ser maior que 0'],
    validate: {
      validator: function(v) {
        return Number.isInteger(v);
      },
      message: 'Carga horária deve ser um número inteiro'
    }
  },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: [true, 'Professor responsável é obrigatório']
  },
  status: {
    type: Boolean,
    required: [true, 'Status é obrigatório'],
    default: true
  }
}, {
  timestamps: true,
  collection: 'disciplinas'
});

// Índice composto para garantir unicidade do nome dentro do mesmo curso (case-insensitive)
disciplinaSchema.index(
  { cursoId: 1, nome: 1 }, 
  { 
    unique: true,
    collation: { locale: 'pt', strength: 2 }
  }
);

/**
 * Modelo Mongoose para Disciplinas
 * @class Disciplina
 */
const Disciplina = mongoose.model('Disciplina', disciplinaSchema);

module.exports = Disciplina;