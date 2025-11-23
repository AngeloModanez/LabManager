const mongoose = require('mongoose');

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
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email deve ter um formato válido']
  },
  telefone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(v);
      },
      message: 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX'
    }
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