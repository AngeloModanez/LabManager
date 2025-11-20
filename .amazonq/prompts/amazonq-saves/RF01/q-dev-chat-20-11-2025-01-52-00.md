<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 200px 0 20px 0;">

<div style="font-size: 24px; margin-bottom: 12px;"><strong>Amazon Q</strong></div>
<div style="background: rgba(128, 128, 128, 0.15); border: 1px solid rgba(128, 128, 128, 0.25); border-radius: 8px; padding: 8px; margin: 4px 0; text-align: center;">
<div style="font-size: 14px; margin-bottom: 4px;"><strong>Did you know?</strong></div>
<div>Ask Q to review your code and see results in the code issues panel!</div>
</div>

Select code & ask me to explain, debug or optimize it, or type `/` for quick actions

</div>

---

 **@RF01_CHORE_arrumando_detalhes**

---


To add your workspace as context, enable local indexing in your IDE settings. After enabling, add @workspace to your question, and I'll generate a response using your workspace as context.

---


Vou analisar o backend do LabManager para verificar e ajustar os atributos de Instituição e Curso conforme os requisitos, além de adicionar validações e remover placeholders do Swagger.

---


Agora vou verificar os modelos atuais de Instituição e Curso para analisar os atributos:

---


Agora vou verificar os controllers e rotas para entender a estrutura atual:

---


Agora vou verificar as rotas e a configuração do Swagger:

---


Agora vou analisar os requisitos e fazer as correções necessárias:

## Análise dos Requisitos:

**Instituição**: nome, sigla, CNPJ, endereço, status ✅
- ❌ Falta: **sigla**
- ✅ Tem: nome, CNPJ, endereço, status (ativo)

**Curso**: instituição, nome, turno(s), status ✅
- ❌ Falta: **turno(s)** e **status**
- ✅ Tem: instituição (instituicaoId), nome

Vou fazer as correções necessárias:

---

Adicionando o campo sigla obrigatório ao modelo de Instituição conforme requisitos

---

Adicionando campos turno e status ao modelo de Curso conforme requisitos

---


Agora vou atualizar as rotas do Swagger para incluir os novos campos e remover os placeholders desnecessários:

---

Atualizando schema do Swagger para Instituição com o campo sigla obrigatório

---

Removendo placeholders e atualizando schema do Swagger para Curso com turnos e status

---

Removendo placeholders e atualizando schema do Swagger para Curso com turnos e status

---

Removendo examples desnecessários do Swagger de cursos

---

Removendo examples desnecessários do Swagger de cursos - primeira ocorrência

---

Removendo examples desnecessários do Swagger de cursos - segunda parte

---

Removendo examples desnecessários do Swagger de cursos - ajuste específico

---

Removendo examples desnecessários do Swagger de cursos - última parte

---

Removendo examples restantes do Swagger de cursos

---

Reescrevendo o arquivo de rotas de cursos sem os placeholders desnecessários

---


Agora vou atualizar o controller de cursos para incluir o filtro por status ativo:

---

Adicionando filtro por status ativo no controller de cursos

---


Agora vou fazer o commit seguindo o padrão Conventional Commits:

---

Adicionando arquivos modificados ao staging

---

shell

---

You stopped your current work and asked me to work on the following task instead.

---

pode colocar exemplos, só n queria que vc já colocasse um id no delete ou no get encher de filtros, mas o resto tava bom

---


Entendi! Vou recolocar os exemplos úteis, mas sem exagerar nos filtros e IDs específicos:

---

Adicionando exemplos úteis de volta ao Swagger de cursos

---

Adicionando exemplos úteis de volta ao Swagger de cursos - primeira parte

---

Adicionando exemplo no POST de cursos

---

Adicionando exemplo no POST de cursos

---

Adicionando exemplo no POST de cursos - específico

---

Adicionando exemplo no PUT de cursos

---


Agora vou fazer o commit seguindo o padrão Conventional Commits:

---

Adicionando arquivos modificados ao staging

---

```shell
git add .