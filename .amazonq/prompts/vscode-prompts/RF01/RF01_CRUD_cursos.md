@projeto @backend  
respostas: pt-br

1.) Implementar endpoint CRUD para Cursos.

a) Criar rota e controllers em: /api/v1/cursos

a.1) POST /api/v1/cursos  
- Cria curso.  
- Body JSON: { nome, codigo?, instituicaoId }  
- instituicaoId obrigatório (ObjectId).  
- nome obrigatório.  
- Retorna 201 + criado.  
- Validar duplicidade de nome dentro da mesma instituição → 409.  

a.2) GET /api/v1/cursos  
- Lista cursos.  
- Filtros:  
  • ?instituicaoId=...  
  • ?nome=... (contains, case-insensitive)  
  • ?page & ?limit  
- Retorna array JSON.  

a.3) PUT /api/v1/cursos/:id  
- Atualização parcial.  
- Retorna 200.  
- 404 se inexistente.  

a.4) DELETE /api/v1/cursos/:id  
- Retorna 204.  
- 404 se inexistente.  

a.5) Padrão de erro  
JSON { message, details? }  
Status: 400, 404, 409, 500.

b) Regras gerais:  
- Usar CommonJS.  
- Model Curso: nome, codigo?, instituicaoId.  
- Relacionamento com Instituição via ObjectId.  
- Paginação simples.  

c) Criar documentação Swagger + JSDoc.

d) Critérios de aceite:  
- POST com nome duplicado dentro da mesma instituição → 409.  
- GET lista com filtros funcionando.  
- PUT/DELETE retornam 404 corretamente.  
- Swagger funcional com exemplos.
