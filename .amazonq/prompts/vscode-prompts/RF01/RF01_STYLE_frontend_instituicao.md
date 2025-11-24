# Prompt para Amazon Q – Revisão e Padronização do Frontend + Integração com Backend

Quero que você atue como revisor e refatorador técnico do frontend do projeto.  
Siga todas as instruções abaixo de forma detalhada e consistente.

---

## 1. Analisar o projeto frontend atual

Analise cuidadosamente toda a estrutura do frontend.  
Quero que você:

1. Identifique código repetido, componentes inúteis ou mal estruturados.  
2. Reorganize o projeto para um padrão mais limpo, com pastas bem definidas, incluindo:  
   - `/components`  
   - `/pages`  
   - `/services`  
   - `/hooks`  
   - `/utils`  
3. Padronize a organização, nomes, padrões de importação e estilo.  
4. Sugira melhorias de arquitetura caso necessário.

---

## 2. Analisar integração frontend + backend

O backend de Instituições passou por ajustes.  
Quero que você:

1. Compare a API atual do backend com o que o frontend consome.  
2. Aponte e corrija inconsistências, URLs, formatos de payload e validações.  
3. Modifique o frontend conforme necessário para garantir que as telas de Instituição funcionem corretamente com o backend atualizado.

---

## 3. Padronizar e criar componentes reutilizáveis

Após a análise, quero que você padronize o design system e crie componentes reutilizáveis no estilo do projeto.  
Crie ou refatore os seguintes componentes:

- Card  
- Modal  
- Button  
- Input  
- SearchBar  
- Table  

Regras importantes:

1. Qualquer componente criado deve ser reutilizável em outras telas.  
2. Sempre que identificar repetição futura, transforme em componente.  
3. Mantenha consistência visual, de props e de comportamento.

---

## 4. Requisitos para o componente Input

O componente de Input deve incluir:

- Validação opcional de tamanho mínimo e máximo.  
- Exibição automática de erro abaixo do campo quando inválido.  
- Borda vermelha quando inválido, retornando ao estilo normal quando válido.  
- Suporte a máscaras utilizando biblioteca adequada.  
- Máscaras obrigatórias:
  - Telefone brasileiro: celular e fixo.
  - CNPJ com formatação padrão.

Exemplos:

Telefone:
- Celular: (DD) 9xxxx-xxxx  
- Fixo: (DD) xxxx-xxxx  
- Deve aceitar também números com +55 para ligações internacionais.

CNPJ:
- Deve exibir a máscara completa durante a digitação.

---

## 5. Requisitos específicos do módulo de Instituição

O formulário de Instituição deve incluir:

1. Nome
2. Sigla
2. Endereço: limite máximo definido.  
3. CNPJ:
   - Deve seguir a regra de valores fixos para as 8 primeiras posições.  
   - As 4 últimas posições devem ser alfanuméricas.  
   - Comprimento total: 14 caracteres.  
4. Telefone:
   - Aceitar telefones fixos e celulares:
     - Celular: DD + 9xxxx-xxxx (11 dígitos)  
     - Fixo: DD + xxxx-xxxx (10 dígitos)
   - Aceitar formato internacional com +55.

A máscara deve ser aplicada automaticamente no input.

---

## 6. O que espero como resultado final

Quero que você:

1. Apresente um plano de reorganização do frontend.  
2. Liste todos os problemas encontrados e suas respectivas correções.  
3. Reestruture o projeto com a nova organização sugerida.  
4. Ajuste toda a tela de Instituições para funcionar com o backend atual.  
5. Crie e documente os novos componentes padronizados.  
6. Garanta que todos os componentes possam ser reutilizados nos demais módulos (Cursos, Professores, etc).  
7. Mostre o código final organizado e atualizado.

---

Analise tudo com precisão técnica e produza o resultado da forma mais completa e padronizada possível.
