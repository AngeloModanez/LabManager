const mongoose = require('mongoose');

/**
 * Schema para o modelo de Blocos de horário
 * @typedef {Object} Bloco
 * @property {string} turno - Turno do bloco
 * @property {string} dia_da_semana - Dia da semana do bloco
 * @property {string} inicio - Horário de início (HH:mm)
 * @property {string} fim - Horário de fim (HH:mm)
 * @property {number} ordem - Ordem do bloco no turno/dia
 * @property {boolean} status - Status ativo/inativo do bloco
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Blocos
 */
const blocoSchema = new mongoose.Schema({
  turno: {
    type: String,
    required: [true, 'Turno é obrigatório'],
    enum: {
      values: ['manhã', 'tarde', 'noite'],
      message: 'Turno deve ser: manhã, tarde ou noite'
    }
  },
  dia_da_semana: {
    type: String,
    required: [true, 'Dia da semana é obrigatório'],
    enum: {
      values: ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
      message: 'Dia da semana deve ser: segunda, terça, quarta, quinta, sexta ou sábado'
    }
  },
  inicio: {
    type: String,
    required: [true, 'Horário de início é obrigatório'],
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Horário de início deve estar no formato HH:mm'
    }
  },
  fim: {
    type: String,
    required: [true, 'Horário de fim é obrigatório'],
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Horário de fim deve estar no formato HH:mm'
    }
  },
  ordem: {
    type: Number,
    required: [true, 'Ordem é obrigatória'],
    min: [1, 'Ordem deve ser maior que 0']
  },
  status: {
    type: Boolean,
    required: [true, 'Status é obrigatório']
  }
}, {
  timestamps: true,
  collection: 'blocos'
});

// Índice composto para unicidade de (turno + dia_da_semana + inicio + fim)
blocoSchema.index({ turno: 1, dia_da_semana: 1, inicio: 1, fim: 1 }, { unique: true });

// Índice composto para unicidade de ordem por (turno + dia_da_semana)
blocoSchema.index({ turno: 1, dia_da_semana: 1, ordem: 1 }, { unique: true });

// Validação customizada: hora fim deve ser maior que hora início
blocoSchema.pre('validate', function() {
  if (this.inicio && this.fim) {
    const [inicioHora, inicioMin] = this.inicio.split(':').map(Number);
    const [fimHora, fimMin] = this.fim.split(':').map(Number);
    
    const inicioMinutos = inicioHora * 60 + inicioMin;
    const fimMinutos = fimHora * 60 + fimMin;
    
    if (fimMinutos <= inicioMinutos) {
      this.invalidate('fim', 'Horário de fim deve ser maior que horário de início');
    }
  }
});

// Validação de sobreposição de horários
blocoSchema.pre('save', async function() {
  if (this.isNew || this.isModified(['turno', 'dia_da_semana', 'inicio', 'fim'])) {
    const [inicioHora, inicioMin] = this.inicio.split(':').map(Number);
    const [fimHora, fimMin] = this.fim.split(':').map(Number);
    
    const inicioMinutos = inicioHora * 60 + inicioMin;
    const fimMinutos = fimHora * 60 + fimMin;
    
    const blocosExistentes = await this.constructor.find({
      _id: { $ne: this._id },
      turno: this.turno,
      dia_da_semana: this.dia_da_semana
    });
    
    for (const bloco of blocosExistentes) {
      const [blocoInicioHora, blocoInicioMin] = bloco.inicio.split(':').map(Number);
      const [blocoFimHora, blocoFimMin] = bloco.fim.split(':').map(Number);
      
      const blocoInicioMinutos = blocoInicioHora * 60 + blocoInicioMin;
      const blocoFimMinutos = blocoFimHora * 60 + blocoFimMin;
      
      // Verifica sobreposição
      if ((inicioMinutos < blocoFimMinutos && fimMinutos > blocoInicioMinutos)) {
        throw new Error('Horário sobrepõe com bloco existente no mesmo turno e dia');
      }
    }
  }
});

/**
 * Modelo Mongoose para Blocos
 * @class Bloco
 */
const Bloco = mongoose.model('Bloco', blocoSchema);

module.exports = Bloco;