# Prompt para Amazon Q — Criar versão mobile do frontend

Objetivo: criar a **versão mobile** (React Native + Expo) do frontend já implementado no web, usando a página de **Instituição** como referência visual, de comportamento e de validações. Seja objetivo: implementar páginas móveis para todas as entidades do frontend (Curso, Professor, Disciplina, Laboratório, Blocos de Aulas) reutilizando componentes quando possível e criando novos apenas quando necessário.


Requisitos mínimos:

1. **Stack**
   - React Native com Expo.
   - UI preferencial: React Native Paper (ou equivalente consistente).
   - Navegação: React Navigation.
   - HTTP: Axios (usar mesmos endpoints do backend web).

2. **Escopo funcional**
   - Páginas móveis para: Instituição (reaproveitar), Curso, Professor, Disciplina, Laboratório, Blocos de Aulas.
   - Cada entidade: listagem (search + lista/cards), criação/edição (form), exclusão (confirm dialog).
   - Reutilizar lógica, validações e mensagens do frontend web (campos obrigatórios, máscaras, limites de tamanho, erros em pt-BR).
   - Máscaras: telefone e CNPJ idênticas ao web.
   - Inputs exibem erro abaixo do campo; borda vermelha enquanto inválido.

3. **Componentização**
   - Reaproveitar componentes de Instituição.
   - Criar somente componentes necessários e reutilizáveis (ex.: MobileInput com máscara, MobileSelectRemoto, MobileTimePicker, MobileList).
   - Documentar props essenciais dos novos componentes.

4. **Integração com backend**
   - Criar services (cursoService, professorService, disciplinaService, laboratorioService, blocoService) com CRUD e tratamento consistente de erros (timeout, 4xx/5xx).
   - Após criar/editar/excluir atualizar listas automaticamente.
   - Exibir mensagens amigáveis em pt-BR para conflitos (409), não encontrado (404) e erros do servidor (500).

5. **UI / UX**
   - Responsivo para diferentes tamanhos de tela (celular padrão, phablet).
   - Estados: loading, vazio, erro (com retry), sucesso (snackbar).
   - Confirmação antes de deletar.

6. **Entrega mínima esperada**
   - Projeto Expo pronto para rodar (`npm install`, `npm start`) apontando por padrão para `http://localhost:3000`.
   - Estrutura de pastas clara: `/src/screens`, `/src/components`, `/src/services`, `/src/hooks`, `/src/utils`.
   - Código das telas para as 5 entidades (list + form).
   - Implementação de pelo menos os seguintes componentes: `MobileInput` (máscara + validação), `MobileSelectRemoto`, `MobileList`.
   - Exemplos de uso (snippets) para a tela de Professores (listagem + formulário).
   - Breve instrução para rodar no emulador/dispositivo (incluindo apontar para IP da máquina, se necessário).

7. **Restrições**
   - Não alterar a implementação web de Instituição; apenas usar como referência.
   - Mensagens e validações em pt-BR.
   - Criar novos componentes apenas se houver reutilização óbvia.

Execute e entregue de forma direta e enxuta: estrutura do projeto, componentes criados, telas implementadas e instruções básicas para rodar e testar.
