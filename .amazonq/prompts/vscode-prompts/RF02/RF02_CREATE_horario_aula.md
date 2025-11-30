Quero que você implemente o RF02 em todas as partes do projeto (backend, frontend e mobile), usando como base tudo o que já existe no código atual das entidades anteriores (Instituição, Curso, Professor, Disciplina, Laboratório e Blocos). Mantenha o mesmo padrão de organização, componentes, validações, serviços, rotas e arquitetura.

---

## RF02: Cadastro de Aulas

### Estrutura da entidade
A entidade Aula deve seguir:

aulas: {
  semestre,
  cursoId,
  disciplinaId,
  professorId,
  laboratorioId,
  diaSemana,
  blocos,
  dataInicio,
  dataFim
}

Regras:
- Uma aula representa uma alocação de uma disciplina em um laboratório.
- Deve impedir conflitos:
  1) Conflito de laboratório (mesmo horário, mesmo dia, mesmo bloco).
  2) Conflito de professor (professor não pode ter duas aulas no mesmo horário).
- Blocos podem ser múltiplos.
- Data de início e fim definem o período de validade da alocação.

---

## O que implementar

### 1. Backend
- Criar model/schema de Aula.
- Criar rotas:
  - POST /api/aulas
  - GET /api/aulas
  - PUT /api/aulas/:id
  - DELETE /api/aulas/:id
- Validar todos os campos.
- Implementar lógica de conflito (laboratório e professor).
- Padronizar erros e mensagens igual ao restante do backend.
- Integrar com curso, disciplina, professor, laboratório e blocos existentes.
- Limpar código inútil e manter padrão de organização já adotado.

### 2. Frontend
Criar páginas seguindo exatamente o padrão do que já foi feito no CRUD das outras entidades:

- Página de listagem de aulas.
- Página/modal de criação de aula.
- Página/modal de edição de aula.
- Usar os componentes já criados:
  - Select remoto (curso, disciplina, professor, laboratório, blocos)
  - Input
  - Modal/Card
  - Tabela
  - SearchBar
- Validar regras:
  - escolher curso → carregar disciplinas do curso
  - professor, laboratório e bloco obrigatórios
  - data início e data fim
- Exibir mensagens claras de conflito usando o padrão do frontend.

### 3. Mobile
Criar as telas equivalentes às do frontend web:

- Tela de listagem de aulas (lista com search).
- Tela de criação/edição:
  - Selects remotos para curso, disciplina, professor e laboratório.
  - Picker de dia da semana.
  - Seleção múltipla de blocos.
  - Inputs de data início/fim (usar DatePicker).
- Validar conflitos com mensagens amigáveis em pt-BR.
- Reutilizar componentes já existentes e criar apenas quando necessário.
- Seguir o mesmo estilo visual do mobile já implementado para Instituição.

---

## Entregue
- O backend completo refatorado com a entidade Aulas e validações de conflito funcionando.
- O frontend com todas as telas e integração com o backend.
- O mobile com telas equivalentes e integração correta.
- Explicação curta das mudanças e arquivos criados.
- Código final organizado conforme o padrão atual do projeto.

---

Siga rigorosamente o estilo, componentes, arquitetura e padrões das implementações anteriores do projeto.
