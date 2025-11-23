const mongoose = require('mongoose');
const { VALIDATORS } = require('../utils/validationPatterns');

/**
 * Schema para o modelo de Professores
 * @typedef {Object} Professor
 * @property {string} nome - Nome do professor
 * @property {string} email - Email do professor
 * @property {string} [telefone] - Telefone do professor
 * @property {boolean} status - Status ativo/inativo do professor
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Professores
 */
const professorSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    trim: true,
    lowercase: true,
    validate: VALIDATORS.email
  },
  telefone: {
    type: String,
    trim: true,
    validate: VALIDATORS.telefone
  },
  status: {
    type: Boolean,
    required: [true, 'Status é obrigatório'],
    default: true
  }
}, {
  timestamps: true,
  collection: 'professores'
});

/**
 * Índice para busca case-insensitive por email
 */
professorSchema.index({ email: 1 }, { 
  unique: true,
  collation: { locale: 'pt', strength: 2 }
});

/**
 * Modelo Mongoose para Professores
 * @class Professor
 */
const Professor = mongoose.model('Professor', professorSchema);

module.exports = Professor;