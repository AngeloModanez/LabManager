# Prompt para Amazon Q – Validação Completa do Backend (RF01)

Quero que você atue como revisor técnico backend e verifique se toda a modelagem, regras e estrutura do backend do RF01 estão corretas, completas e dentro das boas práticas.  
O objetivo é garantir que o backend está pronto para implementação robusta em Node.js + Express + MongoDB.

Analise os requisitos abaixo e, ao final, liste tudo o que estiver faltando, inconsistente ou inadequado, sugerindo correções.

---

## 1. Requisitos dos Cadastros (CRUD)

### Instituição
- nome (obrigatório)
- sigla (obrigatório)
- CNPJ (opcional)
- endereço (opcional)
- status (obrigatório)

### Curso
- instituição (ID obrigatório)
- nome (obrigatório)
- turno(s) (obrigatório)
- status (obrigatório)

### Professor
- nome (obrigatório)
- e-mail institucional (obrigatório, formato válido)
- telefone (opcional, formato válido)
- status (obrigatório)

### Disciplina
- curso (ID obrigatório)
- nome (obrigatório)
- carga horária (obrigatório)
- professor responsável (opcional)
- status (obrigatório)

### Laboratório
- nome / identificador (obrigatório)
- capacidade (obrigatório)
- localização (opcional)
- status (obrigatório)

### Blocos de horário
- turno (obrigatório)
- dia da semana (obrigatório)
- início (obrigatório)
- fim (obrigatório)
- ordem (obrigatório)

---

## 2. Modelo de Dados (MongoDB)

Verifique se os schemas abaixo representam corretamente os requisitos:

instituicoes: { nome, sigla, cnpj, endereco, status }
cursos: { instituicaoId, nome, turnos, status }
professores: { nome, email, telefone, status }
disciplinas: { cursoId, nome, cargaHoraria, professorId, status }
laboratorios: { nome, capacidade, local, status }
blocos: { turno, diaSemana, inicio, fim, ordem }


Valide se:
1. Todos os campos obrigatórios estão marcados como required.
2. Os tipos e formatações estão coerentes (email, telefone, horários).
3. A integridade referencial está preservada (cursoId, professorId, instituicaoId etc.).
4. Campo status deveria ser enum (ex.: ativo, inativo).
5. Campos que deveriam ser únicos (sigla, nome do laboratório) estão definidos como unique.

---

## 3. API REST (Node.js / Express)

Verifique se é necessário estruturar e validar CRUDs completos para:

- /api/instituicoes
- /api/cursos
- /api/professores
- /api/disciplinas
- /api/laboratorios
- /api/blocos

Analise:

1. Cada rota deve ter GET (listar), GET/:id, POST, PUT/PATCH, DELETE.
2. Validações devem acontecer antes do controller (middlewares).
3. Erros devem seguir padrão consistente, como:

{
success: false,
message: "...",
details: { ... }
}


4. Retornos de sucesso também devem seguir padrão.
5. Verificar necessidade de soft delete ou delete físico.
6. Garantir que exclusões não causem inconsistências (ex.: excluir instituição com cursos ativos).

---

## 4. Conformidade com RF01

Avalie se os itens do RF01 estão totalmente contemplados:

RF01: CRUD de Instituição, Curso, Professor, Disciplina, Laboratório e Blocos.

Responda:

1. O conjunto de requisitos está completo para implementação?
2. Os modelos MongoDB atendem 100% dos requisitos de RF01?
3. As rotas CRUD cobrem todos os casos esperados?
4. As validações necessárias estão descritas corretamente?
5. Há requisitos implícitos ainda não cobertos?
6. Há riscos de inconsistência no banco?
7. Falta alguma regra de negócio?
8. O padrão de erros está adequado?
9. Tudo está conforme para um backend robusto?

---

## 5. Entregável esperado

Quero que sua resposta final traga:

1. Checklist de conformidade ponto a ponto.
2. Correções necessárias, se houver.
3. Recomendações de boas práticas para Node + Express + MongoDB.
4. Lista final validada do que deve ser implementado no RF01.

---

Faça uma revisão completa, com profundidade técnica, e indique se está tudo conforme ou o que precisa ser corrigido.