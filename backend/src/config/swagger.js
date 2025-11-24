const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Configuração do Swagger
 * @module Swagger
 */

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema de Laboratórios',
      version: '1.0.0',
      description: 'API para gerenciamento de laboratórios - PM2025-2',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

/**
 * Configura o Swagger UI
 * @param {Object} app - Aplicação Express
 */
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('Swagger UI disponível em: http://localhost:3000/api-docs');
};

module.exports = { setupSwagger };