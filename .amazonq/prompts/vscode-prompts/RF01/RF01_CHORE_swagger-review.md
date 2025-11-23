Quero padronizar todos os meus **Schemas**, **DTOs** e arquivos relacionados a **validação** e **documentação**.  
Analise **todos os meus schemas, controllers e arquivos de Swagger** no projeto e aplique as seguintes regras padronizadas:

---

## 1. Campos com formatação específica

Para qualquer schema ou DTO que contenha:

- **email**
- **telefone**
- **cnpj**
- **qualquer outro campo que exija um formato específico**

Aplique o seguinte padrão:

### **PUT (criação)**

- manter o campo com o **valor real**, conforme validado pelo schema  
- aplicar validação apropriada: email válido, telefone válido, cnpj válido, etc.

### **UPDATE (patch)**

- manter as mesmas validações  
- porém usar **valores de exemplo padronizados**, como:
  - **email:** `email.example@email.com`
  - **telefone:** `(99) 99999-9999`
  - **cnpj:** `12.345.678/0001-90`
  - outros campos devem seguir o padrão brasileiro ou o mais comum no projeto

---

## 2. Padronização do Swagger

Para todas as rotas, padronize:

- campos com **examples coerentes**
- descrições com **estilo uniforme**
- schemas consistentes entre **PUT**, **PATCH** e **GET**
- exemplos alinhados com os padrões definidos (email/telefone/cnpj/etc.)
- coerência de **tipos** e **obrigatoriedade**
- correção de redundâncias ou inconsistências nos exemplos

---

## 3. Validações

Se algum campo tiver validação duplicada ou mal definida, padronizar para:

- **apenas um índice por campo**
- **validações centralizadas**
- validações iguais em **DTOs**, **Schemas** e **Swagger**

---

## 4. Resultado esperado

Aplique as alterações diretamente nos arquivos necessários, mantendo:

- estilo de código atual do projeto  
- mesma formatação  
- mesma estrutura de pastas  

Se for necessário criar **utilitários de validação** ou **exemplos padronizados**, pode criar também.
