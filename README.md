# 🧪 LabManager - Sistema de Gerenciamento de Laboratórios

Sistema completo para gerenciamento de laboratórios com Backend (Node.js), Frontend (React) e Mobile (Expo).

## 🚀 Como Rodar

### Backend + Frontend (Docker)
```bash
cd LabManager/infra
./start-dev.sh
```

**Serviços:**
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- Portainer: http://localhost:9000

### Mobile (Local)
```bash
cd LabManager/mobile
npm install
cp .env.example .env
# Edite .env com IP da sua máquina
npm start
```

### Parar Tudo
```bash
cd LabManager/infra
./stop-dev.sh
```

## ⚙️ Configuração Mobile

### Descobrir IP da máquina:
```bash
ip addr show | grep inet  # Linux/Mac
ipconfig                  # Windows
```

### Mobile (.env)
```env
# Substitua pelo IP da sua máquina
API_BASE_URL=http://192.168.1.100:3000/api/v1

# Emuladores:
# Android: http://10.0.2.2:3000/api/v1
# iOS: http://localhost:3000/api/v1
```

## 🧹 Limpeza

### Parar e Limpar Tudo
```bash
cd LabManager/infra
./stop-dev.sh

# Remover imagens do projeto
docker rmi labmanager-dev-backend labmanager-dev-frontend

# Remover volumes (apaga dados do MongoDB)
docker volume rm labmanager-dev_mongodb_data labmanager-dev_portainer_data

# Limpeza completa do Docker (cuidado!)
docker system prune -a --volumes -f
```

## 📋 Logs
```bash
# Ver logs em tempo real
docker compose -f infra/docker-compose.dev.yml logs -f

# Logs específicos
docker compose -f infra/docker-compose.dev.yml logs -f backend
```

## 🚀 Produção
```bash
cd infra
# Edite .env.prod primeiro!
./start-prod.sh
```

## 🛠️ Problemas Comuns

### Mobile não conecta
1. Backend rodando? http://localhost:3000
2. IP correto no `.env` do mobile?
3. Teste no navegador: http://SEU_IP:3000

### Rebuild completo
```bash
cd infra
./stop-dev.sh
docker system prune -a --volumes -f
./start-dev.sh
```