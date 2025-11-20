# Criar Endpoints de Autenticação e Geração de Token JWT

Crie endpoints completos para autenticação com JWT incluindo:

## Endpoints necessários:
- **POST /auth/login** - Autenticação de usuário e geração de token
- **GET /auth/verify** - Verificação de token válido
- **POST /auth/refresh** - Renovação de token (opcional)

## Funcionalidades:
- Validação de credenciais
- Geração de token JWT com payload personalizado
- Middleware de autenticação para proteger rotas
- Tratamento de erros de autenticação
- Validação de dados de entrada com Joi
- Documentação Swagger dos endpoints

## Configurações:
- Secret key configurável via environment
- Tempo de expiração do token configurável
- Estrutura de resposta padronizada
- Logs de auditoria para tentativas de login

Implemente seguindo os padrões já estabelecidos no projeto (Controller, Service, Routes, Validators).