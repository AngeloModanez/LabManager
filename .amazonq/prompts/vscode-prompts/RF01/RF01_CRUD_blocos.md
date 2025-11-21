@projeto @backend  
respostas: pt-br

1. Contexto  
Projeto LabManager — backend Node.js + Express + MongoDB.  
CRUD de Instituições é a referência para formato, validações e responses.  
Entidade Blocos de horário: turno, dia da semana, início, fim, ordem, status.

2. O que fazer  
Criar:
- Model: `Bloco.js`
- Controller: `blocoController.js`
- Rotas: `blocoRoutes.js` → `/api/v1/blocos`

Atributos obrigatórios:
- **turno**: enum [`manhã`, `tarde`, `noite`], obrigatório  
- **dia_da_semana**: enum [`segunda`, `terça`, `quarta`, `quinta`, `sexta`, `sábado`], obrigatório  
- **inicio**: string (HH:mm), obrigatório  
- **fim**: string (HH:mm), obrigatório  
- **ordem**: number, obrigatório  
- **status**: boolean, obrigatório

Validações:
Regras de unicidade
- A combinação **(turno + dia_da_semana + inicio + fim)** deve ser **única** (não permitir blocos duplicados).
- A **ordem** deve ser única por **(turno + dia_da_semana)**.
- A **identificação** deve ser única.

Horários
- **Hora final deve ser maior que hora inicial**.
- **Não permitir sobreposição de horários** dentro do mesmo turno e dia.  
- Filtros simples: turno, dia_da_semana, status
- Paginação  

3. Regras gerais  
- Usar CommonJS  
- Padrão de tratamento de erros igual ao de Instituições  
- JSON de erro: { message, details? }  

4. Swagger  
Documentar todas as rotas com schemas completos, mas sem filtros e IDs específicos.

5. Referências  
- `/projeto/backend`  
- CRUD de Instituições

6. Entrega  
Código final dos arquivos com caminhos completos.
