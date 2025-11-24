/**
 * Exemplos padronizados para documentação Swagger
 * @module SwaggerExamples
 */

const { EXAMPLES } = require('./validationPatterns');

/**
 * Exemplos para criação (POST)
 */
const CREATE_EXAMPLES = {
  instituicao: {
    nome: "Faculdade de Tecnologia Dom Amaury Castanho",
    sigla: "FATEC ITU",
    cnpj: "12.345.678/0001-90",
    email: "contato@fatecitu.edu.br",
    telefone: "(11) 4013-1872",
    endereco: "Av. Tiradentes, 1211 - Vila Esperança, Itu - SP",
    ativo: true
  },
  
  professor: {
    nome: "João Silva",
    email: "joao.silva@fatec.sp.gov.br",
    telefone: "(11) 99999-9999",
    status: true
  },
  
  curso: {
    nome: "Análise e Desenvolvimento de Sistemas",
    codigo: "ADS",
    turnos: ["manhã", "tarde"],
    instituicaoId: "507f1f77bcf86cd799439011",
    ativo: true
  },
  
  disciplina: {
    nome: "Programação Orientada a Objetos",
    cursoId: "507f1f77bcf86cd799439011",
    cargaHoraria: 80,
    professorId: "507f1f77bcf86cd799439012",
    status: true
  },
  
  laboratorio: {
    nome: "Laboratório de Informática 1",
    capacidade: 30,
    localizacao: "Bloco A - Sala 101",
    status: true
  },
  
  bloco: {
    turno: "tarde",
    dia_da_semana: "segunda",
    inicio: "13:20",
    fim: "14:10",
    ordem: 1,
    status: true
  }
};

/**
 * Exemplos para atualização parcial (PATCH)
 */
const UPDATE_EXAMPLES = {
  instituicao: {
    nome: "Faculdade Atualizada",
    email: EXAMPLES.email,
    telefone: EXAMPLES.telefone,
    ativo: false
  },
  
  professor: {
    nome: "Professor Atualizado",
    email: EXAMPLES.email,
    telefone: EXAMPLES.telefone,
    status: false
  },
  
  curso: {
    nome: "Curso Atualizado",
    turnos: ["noite"],
    ativo: false
  },
  
  disciplina: {
    nome: "Disciplina Atualizada",
    cargaHoraria: 60,
    status: false
  },
  
  laboratorio: {
    nome: "Laboratório Atualizado",
    capacidade: 35,
    localizacao: "Bloco B - Sala 201",
    status: false
  },
  
  bloco: {
    turno: "tarde",
    dia_da_semana: "terça",
    inicio: "14:00",
    fim: "14:50",
    ordem: 2,
    status: false
  }
};

module.exports = {
  CREATE_EXAMPLES,
  UPDATE_EXAMPLES
};