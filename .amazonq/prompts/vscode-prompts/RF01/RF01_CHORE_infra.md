# Prompt para Amazon Q — Infraestrutura do Projeto (Backend + Frontend + Mobile + MongoDB)

Contexto:
- O projeto já possui um `docker-compose.yml` que sobe o MongoDB.
- Preciso criar ou reorganizar a infraestrutura completa para rodar Backend, Frontend Web e Mobile.
- Quero entender se é viável rodar tudo no Docker Compose e qual seria a forma adequada de estruturar isso.
- Desejo um padrão de organização da pasta `/infra` e do repositório geral.

Tarefas que quero que você execute:

1. **Analisar infraestrutura atual**
   - Considerar o `docker-compose.yml` existente que sobe apenas o MongoDB.
   - Verificar se é adequado adicionar containers para Backend e Frontend web.
   - Avaliar se o Mobile deve rodar em Docker ou se é mais recomendado rodar fora do Docker (Expo + USB/emulador).

2. **Criar um plano de infraestrutura recomendado**
   - Me diga a forma ideal de organizar o repositório:
     ```
     /backend
     /frontend
     /mobile
     /infra
     ```
   - Definir se devo ter um docker-compose único ou múltiplos arquivos (`compose.dev.yml`, `compose.prod.yml`, etc.).
   - Sugerir variáveis de ambiente (backend url, banco, porta, mobile pointing to backend).

3. **Criar o docker-compose completo**
   - Criar a versão ideal do docker-compose para desenvolvimento contendo:
     - backend (Node.js)
     - frontend (React)
     - mongodb (já existe, mas deve ser ajustado se necessário)
   - Explicar como configurar bind-mounts para hot reload no backend e no frontend.
   - Informar se devo expor portas diferentes ou criar uma rede interna docker.

4. **Mobile**
   - Esclarecer se é viável/adequado rodar o mobile via Docker.
   - Caso não seja recomendado, explicar por quê.
   - Criar um fluxo simples para:
     - Backend rodando no Docker
     - Mobile rodando via Expo local, apontando para o backend (IP da máquina local + porta mapeada)
   - Criar instruções de como configurar `.env` do mobile apontando para o backend container.

5. **Entrega esperada**
   - Fornecer:
     - Estrutura de pastas recomendada.
     - docker-compose completo para ambiente de desenvolvimento.
     - Exemplo de `.env` do backend, frontend e mobile.
     - Explicação de como iniciar tudo com um único comando.
     - Alternativas para produção (NGINX, serviços externos, build estático, etc.), mas de forma resumida.

Objetivo final:
Quero que você proponha a infraestrutura mais adequada e prática para desenvolvimento do projeto, garantindo padronização e escalabilidade, e me entregue o docker-compose e as instruções completamente prontos para uso.
