/**
 * Padrões de validação padronizados
 * @module ValidationPatterns
 */

/**
 * Exemplos padronizados para documentação
 */
const EXAMPLES = {
  email: 'email.example@email.com',
  telefone: '(99) 99999-9999',
  cnpj: '12.345.678/0001-90'
};

/**
 * Expressões regulares para validação
 */
const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
};

/**
 * Mensagens de erro padronizadas
 */
const MESSAGES = {
  email: 'Email deve ter um formato válido',
  telefone: 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX',
  cnpj: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'
};

/**
 * Validadores padronizados para Mongoose
 */
const VALIDATORS = {
  email: {
    validator: function(v) {
      return !v || REGEX.email.test(v);
    },
    message: MESSAGES.email
  },
  
  telefone: {
    validator: function(v) {
      return !v || REGEX.telefone.test(v);
    },
    message: MESSAGES.telefone
  },
  
  cnpj: {
    validator: function(v) {
      return REGEX.cnpj.test(v);
    },
    message: MESSAGES.cnpj
  }
};

module.exports = {
  EXAMPLES,
  REGEX,
  MESSAGES,
  VALIDATORS
};