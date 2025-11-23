const mongoose = require('mongoose');

/**
 * Schema para o modelo de Laboratórios
 * @typedef {Object} Laboratorio
 * @property {string} nome - Nome do laboratório
 * @property {number} capacidade - Capacidade do laboratório
 * @property {string} [localizacao] - Localização do laboratório
 * @property {boolean} status - Status ativo/inativo do laboratório
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Laboratórios
 */
const laboratorioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter no mínimo 2 caracteres'],
    maxlength: [120, 'Nome deve ter no máximo 120 caracteres'],
    validate: {
      validator: function(v) {
        return !/^[\d\W]+$/.test(v);
      },
      message: 'Nome não pode ser composto apenas por números ou caracteres especiais'
    }
  },
  capacidade: {
    type: Number,
    required: [true, 'Capacidade é obrigatória'],
    min: [1, 'Capacidade deve ser maior que 0'],
    validate: {
      validator: Number.isInteger,
      message: 'Capacidade deve ser um número inteiro'
    }
  },
  localizacao: {
    type: String,
    trim: true,
    maxlength: [200, 'Localização deve ter no máximo 200 caracteres']
  },
  status: {
    type: Boolean,
    required: [true, 'Status é obrigatório'],
    default: true
  }
}, {
  timestamps: true,
  collection: 'laboratorios'
});

/**
 * Índice para garantir unicidade do nome (case-insensitive)
 */
laboratorioSchema.index({ nome: 1 }, { 
  unique: true,
  collation: { locale: 'pt', strength: 2 }
});

/**
 * Modelo Mongoose para Laboratórios
 * @class Laboratorio
 */
const Laboratorio = mongoose.model('Laboratorio', laboratorioSchema);

module.exports = Laboratorio;