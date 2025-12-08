const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Configurações
const config = require('./config/configurationLoader');
const { connectDatabase } = require('./config/database');
const { createHttpsServer } = require('./config/httpsConfig');
const { setupSwagger } = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

// Rotas
const instituicoesRoutes = require('./routes/instituicaoRoutes');
const cursosRoutes = require('./routes/cursoRoutes');
const blocosRoutes = require('./routes/blocoRoutes');
const professoresRoutes = require('./routes/professorRoutes');
const laboratoriosRoutes = require('./routes/laboratorioRoutes');
const disciplinasRoutes = require('./routes/disciplinaRoutes');
const aulasRoutes = require('./routes/aulaRoutes');
const horariosRoutes = require('./routes/horarioRoutes');

/**
 * Aplicação Express principal
 * @module Server
 */

const app = express();

// Middlewares de segurança e logging
app.use(helmet());
app.use(morgan('combined'));

// CORS
app.use(cors({
  origin: config.app.corsOrigin
}));

// Parser JSON
app.use(express.json());

// Conectar ao banco de dados
connectDatabase();

// Configurar Swagger
setupSwagger(app);

// Rotas da API
app.use('/api/v1/instituicoes', instituicoesRoutes);
app.use('/api/v1/cursos', cursosRoutes);
app.use('/api/v1/blocos', blocosRoutes);
app.use('/api/v1/professores', professoresRoutes);
app.use('/api/v1/laboratorios', laboratoriosRoutes);
app.use('/api/v1/disciplinas', disciplinasRoutes);
app.use('/api/v1/aulas', aulasRoutes);
app.use('/api/v1/horarios', horariosRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Sistema de Laboratórios - PM2025-2',
    version: '1.0.0',
    docs: '/api-docs'
  });
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Iniciar servidor
const startServer = () => {
  const httpsServer = createHttpsServer(app);
  
  if (httpsServer) {
    httpsServer.listen(config.app.port, () => {
      console.log(`Servidor HTTPS rodando na porta ${config.app.port}`);
      console.log(`Acesse: https://localhost:${config.app.port}`);
    });
  } else {
    app.listen(config.app.port, () => {
      console.log(`Servidor HTTP rodando na porta ${config.app.port}`);
      console.log(`Acesse: http://localhost:${config.app.port}`);
    });
  }
};

startServer();

module.exports = app;