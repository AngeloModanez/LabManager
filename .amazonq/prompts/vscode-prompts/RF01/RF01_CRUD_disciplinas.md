@projeto @backend  
respostas: pt-br

1. Contexto  
Projeto LabManager — backend Node.js + MongoDB.  
CRUD de Instituições é o padrão principal de referência (estrutura, formato de controller, responses, validações e mensagens).  
Entidade Disciplina: curso, nome, cargaHoraria, professorResponsavel, status.

2. O que fazer  
Criar:
- Model: `Disciplina.js`
- Controller: `disciplinaController.js`
- Rotas: `disciplinaRoutes.js` → `/api/v1/disciplinas`

Atributos obrigatórios:
- nome: string  
- cursoId: ObjectId (referência Curso)  
- cargaHoraria: number > 0  
- professorId: ObjectId (referência Professor)  
- status: boolean  

Validações:   
- Todos os atributos são obrigatórios.  
- `cursoId` e `professorId` devem ser **ObjectId válidos**.  
- `nome` deve ser string válida, com `trim()`, e tamanho mínimo (ex. ≥ 3).  
- `cargaHoraria` deve ser > 0, número inteiro
- Paginação  
- Filtros: ?cursoId, ?professorId, ?status, ?nome, ?page, ?limit  

Unicidade:
- **Não permitir nome duplicado dentro do mesmo curso**:  
  Chave única: 
  - Comparação de nome deve ser **case-insensitive** e preferencialmente normalizada sem acentos para evitar duplicidades como “Gestão” vs “gestao”.

Regras de integridade de negócio:
- **Carga horária deve ser um número inteiro** (disciplina não pode ter “12.5 horas”).  
- Nome não pode ser formado apenas por números ou caracteres especiais.  
- Impedir duplicidade por variação de espaços: “Gestão   Estratégica” vs “Gestão Estratégica”. 

3. Regras gerais  
- Usar CommonJS  
- Seguir padrões do CRUD de Instituições  
- JSON de erro: { message, details? }  
- StatusCode

4. Swagger  
Documentar todas as rotas com schemas completos, mas sem filtros e IDs específicos.


5. Referências  
- Analisar todo `/projeto/backend`  
- `/src/models/Instituicao.js`  
- `/src/controllers/instituicaoController.js`  
- Model/Controller de Cursos e Professores (se já existentes)  

6. Entrega  
Código final completo com caminhos corretos.
