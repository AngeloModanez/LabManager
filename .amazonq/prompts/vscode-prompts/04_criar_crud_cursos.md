Crie uma aplicação integrada com o frontend, seguindo o padrão da aplicação (frontend), que implmente CRUD em curso, utilizando a API (endpoints) definidos no backend. Integre o CRUD ao dashboard da aplicação.

Ocorreu um erro ao realizar a inclusão do curso. O erro foi: 
:3000/api/v1/cursos:1  Failed to load resource: the server responded with a status of 500 (Internal Server Error)

O erro está relacionado ao payload da requisição: O enviado é {nome: "string", descricao: ""}
descricao
: 
""
nome
:  
"string", 

porém o endpoint espera: 
{
  "nome": "string"
}

Corrija isso.