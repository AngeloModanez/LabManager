@projeto @backend  
respostas: pt-br

1. Contexto  
Projeto LabManager — backend Node.js, Express, MongoDB.  
CRUD de Instituições serve como base de padrão, responses, tratamento de erro, estrutura e validações.  
Professor: nome, email, telefone (opcional), status.

2. O que fazer  
Criar:
- Model: `Professor.js`
- Controller: `professorController.js`
- Rotas: `professorRoutes.js` → `/api/v1/professores`

Atributos e Validações:
- nome: string  
- email: string e único
- status: boolean (ativo/inativo)

Atributos opcionais:
- telefone: string 

nome
- obrigatório  
- aplicar `trim()`  
- tamanho mínimo recomendado (ex.: ≥ 3)  
- não permitir apenas números ou caracteres especiais  

email
- obrigatório
- aplicar `trim()`
- converter para minúsculas
- formato válido  
- único no sistema (case-insensitive)   

telefone (opcional)
- aplicar `trim()`  
- validar apenas se fornecido  
- permitir formatos padrão (com máscara)

status
- obrigatório  
- boolean

Regras específicas:
- Impedir criação ou atualização com email já existente.  
- No update, caso o email seja alterado, repetir verificação de exclusividade.   
- Filtros: ?nome, ?status  
- Paginação padrão

3. Regras gerais  
- Usar CommonJS  
- Repetir padrão de Instituições  
- Validar formato de email  
- JSON de erro: { message, details? }  
- StatusCode

4. Swagger  
Documentar todas as rotas com schemas completos, mas sem filtros e IDs específicos.

5. Referências  
- `/projeto/backend`  
- CRUD de Instituições

6. Entrega  
Código completo e organizado conforme estrutura do projeto.
