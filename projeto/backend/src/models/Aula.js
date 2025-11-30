const mongoose = require('mongoose');

/**
 * Schema para o modelo de Aulas
 * @typedef {Object} Aula
 * @property {string} semestre - Semestre da aula
 * @property {ObjectId} cursoId - ID do curso
 * @property {ObjectId} disciplinaId - ID da disciplina
 * @property {ObjectId} professorId - ID do professor
 * @property {ObjectId} laboratorioId - ID do laboratório
 * @property {string} diaSemana - Dia da semana
 * @property {Array<ObjectId>} blocos - Array de IDs dos blocos
 * @property {Date} dataInicio - Data de início da aula
 * @property {Date} dataFim - Data de fim da aula
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Aulas
 */
const aulaSchema = new mongoose.Schema({
  semestre: {
    type: String,
    required: [true, 'Semestre é obrigatório'],
    enum: {
      values: ['1', '2'],
      message: 'Semestre deve ser 1 ou 2'
    }
  },
  cursoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'Curso é obrigatório']
  },
  disciplinaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disciplina',
    required: [true, 'Disciplina é obrigatória']
  },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: [true, 'Professor é obrigatório']
  },
  laboratorioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratorio',
    required: [true, 'Laboratório é obrigatório']
  },
  diaSemana: {
    type: String,
    required: [true, 'Dia da semana é obrigatório'],
    enum: {
      values: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      message: 'Dia da semana deve ser: Segunda, Terça, Quarta, Quinta, Sexta ou Sábado'
    }
  },
  blocos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bloco',
    required: true
  }],
  dataInicio: {
    type: Date,
    required: [true, 'Data de início é obrigatória']
  },
  dataFim: {
    type: Date,
    required: [true, 'Data de fim é obrigatória']
  }
}, {
  timestamps: true,
  collection: 'aulas'
});

// Validação: data fim deve ser maior que data início
aulaSchema.pre('validate', function() {
  if (this.dataInicio && this.dataFim) {
    if (this.dataFim <= this.dataInicio) {
      this.invalidate('dataFim', 'Data de fim deve ser maior que data de início');
    }
  }
});

// Validação de conflitos
aulaSchema.pre('save', async function() {
  if (this.isNew || this.isModified(['laboratorioId', 'professorId', 'diaSemana', 'blocos', 'dataInicio', 'dataFim'])) {
    
    // Verificar conflito de laboratório
    const conflitosLaboratorio = await this.constructor.find({
      _id: { $ne: this._id },
      laboratorioId: this.laboratorioId,
      diaSemana: this.diaSemana,
      blocos: { $in: this.blocos },
      dataInicio: { $lte: this.dataFim },
      dataFim: { $gte: this.dataInicio }
    });

    if (conflitosLaboratorio.length > 0) {
      throw new Error('Conflito de laboratório: já existe uma aula neste laboratório no mesmo horário');
    }

    // Verificar conflito de professor
    const conflitoProfessor = await this.constructor.find({
      _id: { $ne: this._id },
      professorId: this.professorId,
      diaSemana: this.diaSemana,
      blocos: { $in: this.blocos },
      dataInicio: { $lte: this.dataFim },
      dataFim: { $gte: this.dataInicio }
    });

    if (conflitoProfessor.length > 0) {
      throw new Error('Conflito de professor: professor já possui aula neste horário');
    }
  }
});

/**
 * Modelo Mongoose para Aulas
 * @class Aula
 */
const Aula = mongoose.model('Aula', aulaSchema);

module.exports = Aula;