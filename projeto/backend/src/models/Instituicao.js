const mongoose = require('mongoose');

/**
 * Schema para o modelo de Instituições
 * @typedef {Object} Instituicao
 * @property {string} nome - Nome da instituição
 * @property {string} cnpj - CNPJ da instituição
 * @property {string} [email] - Email da instituição
 * @property {string} [telefone] - Telefone da instituição
 * @property {string} [endereco] - Endereço da instituição
 * @property {boolean} [ativo] - Status ativo/inativo da instituição
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Instituições
 */
const instituicaoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  cnpj: {
    type: String,
    required: [true, 'CNPJ é obrigatório'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email deve ter um formato válido']
  },
  telefone: {
    type: String,
    trim: true
  },
  endereco: {
    type: String,
    trim: true,
    maxlength: [200, 'Endereço deve ter no máximo 200 caracteres']
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'instituicoes'
});

/**
 * Modelo Mongoose para Instituições
 * @class Instituicao
 */
const Instituicao = mongoose.model('Instituicao', instituicaoSchema);

module.exports = Instituicao;