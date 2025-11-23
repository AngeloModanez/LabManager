@projeto @backend  
respostas: pt-br

1. Contexto  
Projeto LabManager — backend Node.js + MongoDB.  
CRUD de Instituições é o padrão de referência obrigatório.  
Entidade Laboratório: nome, capacidade, localização (opcional), status.

2. O que fazer  
Criar:
- Model: `Laboratorio.js`
- Controller: `laboratorioController.js`
- Rotas: `laboratorioRoutes.js` → `/api/v1/laboratorios`

Atributos obrigatórios  
- nome: string  
- capacidade: number > 0  
- status: boolean  
- localizacao: string (opcional)

Validações:
- Nome deve ser único 
- Filtros: ?blocoId, ?status, ?nome, ?page, ?limit  

nome:  
- obrigatório  
- string, `trim()`  
- mínimo recomendado: 2 caracteres  
- máximo recomendado: 120  
- evitar nomes compostos apenas por números/caracteres especiais  
- comparação case-insensitive (para unicidade)  

capacidade:  
- obrigatório  
- number > 0  
- inteiro (não permitir valores decimais)  

localizacao:  
- opcional  
- string  
- normalizar com `trim()`  
- máximo recomendado: 200 caracteres 

status:
- obrigatório  
- boolean

3. Regras gerais  
- Usar CommonJS  
- Seguir padrão de Instituições  
- JSON de erro: { message, details? }  
- StatusCode

4. Swagger  
Documentar esquema completo (incluindo recursos).  
Documentar todas as rotas com schemas completos, mas sem filtros e IDs específicos.

5. Referências  
- Todo `/projeto/backend`  
- Models/Controllers de Instituições e Blocos  

6. Entrega  
Código completo dos novos arquivos com caminhos corretos.
