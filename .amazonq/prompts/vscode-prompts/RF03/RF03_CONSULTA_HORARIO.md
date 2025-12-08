Analise todo o backend, frontend e mobile na pasta ./LabManager/projeto/
Quero que você implemente o RF03 de forma completa no **backend, frontend e mobile**, usando como base tudo que já existe no projeto e seguindo os mesmos padrões visuais, estruturais e de validação já aplicados nos módulos anteriores.

## RF03: Consulta de Horários
A consulta de horários deve permitir visualizar todas as aulas cadastradas no RF02, organizadas por filtros e em formato de grade semanal.  
A fonte de dados é a entidade `aulas` (semestre, cursoId, disciplinaId, professorId, laboratorioId, diaSemana, blocos, dataInicio, dataFim).

Use como base os pdfs na pasta ./LabManager/Documents/
Crie meio que 3 tabelas, uma para cada turno, faça algo bem parecido com ao pdf, gostaria que essa consulta ficasse na tela home, com uma tela scrollavel e com a navbar azul seguindo.

### O que deve ser implementado:

---

## 1. Backend
Criar endpoints de consulta com filtros:

- GET /api/horarios?laboratorioId=  
- GET /api/horarios?cursoId=  
- GET /api/horarios?disciplinaId=  
- GET /api/horarios?professorId=  

Regras:
- Permitir combinar filtros (ex.: curso + professor, laboratório + dia da semana, etc.).
- Retornar todos os blocos ocupados, já agrupados por dia da semana e ordenados pela ordem do bloco.
- A consulta deve considerar `dataInicio` e `dataFim` (somente aulas válidas naquele período).
- Retornar dados completos para exibição: nome da disciplina, nome do professor, nome do laboratório, etc. (populate ou join equivalente).
- Não precisa recriar conflitos; apenas consultar o que já existe.

---

## 2. Frontend (web)
Criar uma nova página chamada **Consulta de Horários**, seguindo exatamente o padrão visual e de componentes do projeto:

### Tela deve conter:
- Filtros:
  - Laboratório (select remoto)
  - Curso (select remoto)
  - Disciplina (select remoto)
  - Professor (select remoto)
  - Semestre
- Botão “Consultar”
- Grade semanal (segunda → sábado) com linhas por bloco:
  - Para cada bloco e dia, mostrar:
    - Disciplina
    - Professor
    - Curso
    - Laboratório
  - Quando não houver aula, deixar vazio
  - Quando houver múltiplos blocos consecutivos, manter exibidos separadamente (como no Excel do pdf)

### Observações:
- Reutilizar todos os componentes já criados (Input, Select, Table, Card, etc.).
- Criar componente novo **somente se necessário**, como por exemplo:
  - `GradeSemanal`
  - `HorarioCelula`
- Seguir exatamente o estilo e padronização do frontend.

---

## 3. Mobile (React Native)
Criar a mesma funcionalidade do frontend, adaptada para mobile, usando o mesmo padrão do módulo de Instituições:

### Deve conter:
- Filtros usando selects móveis (curso, disciplina, professor, laboratório, semestre).
- Botão “Buscar”.
- Exibição em grade semanal:
  - Pode ser uma lista vertical onde cada dia é um card expandível.
  - Dentro de cada card, mostrar os blocos e as aulas alocadas.
  - Interface responsiva usando React Native Paper.

### Regras:
- Reutilizar componentes já existentes quando possível.
- Criar apenas os que forem realmente necessários (ex.: GradeSemanalMobile).
- Usar as mesmas mensagens de erro e validações do frontend.
- Tratamento de erros em pt-BR.
- A mesma lógica de filtragem do backend deve ser usada no mobile.

---

## 4. Entregáveis esperados
- Backend completo com endpoints de consulta funcionando.
- Nova página do frontend totalmente funcional, seguindo o padrão do projeto.
- Telas mobile equivalentes, também seguindo o padrão do projeto.
- Componentes criados ou reaproveitados organizados nas pastas corretas.
- Código limpo, organizado e consistente com os módulos anteriores.
