const fs = require('fs');
const https = require('https');
const config = require('./configurationLoader');

/**
 * Configuração HTTPS
 * @module HttpsConfig
 */

/**
 * Cria servidor HTTPS se habilitado
 * @param {Object} app - Aplicação Express
 * @returns {Object|null} Servidor HTTPS ou null
 */
const createHttpsServer = (app) => {
  if (!config.https.enabled) {
    return null;
  }

  try {
    const options = {
      key: fs.readFileSync(config.https.keyPath),
      cert: fs.readFileSync(config.https.certPath)
    };
    
    return https.createServer(options, app);
  } catch (error) {
    console.error('Erro ao carregar certificados HTTPS:', error.message);
    console.log('Iniciando servidor HTTP...');
    return null;
  }
};

module.exports = { createHttpsServer };