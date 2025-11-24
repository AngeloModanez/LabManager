# 📱 LabManager Mobile

App mobile desenvolvido com Expo e React Native para gerenciamento de laboratórios.

## 🚀 Configuração Rápida

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Backend
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com o IP da sua máquina
# Substitua 192.168.1.100 pelo IP real
```

### 3. Descobrir IP da Máquina
```bash
# Linux/Mac
ip addr show | grep inet
# ou
ifconfig | grep inet

# Windows
ipconfig
```

### 4. Iniciar o App
```bash
npm start
```

## ⚙️ Configurações de IP

### Desenvolvimento Local
```env
# .env
API_BASE_URL=http://192.168.1.100:3000/api/v1
```

### Emuladores
```env
# Android Emulator
API_BASE_URL=http://10.0.2.2:3000/api/v1

# iOS Simulator
API_BASE_URL=http://localhost:3000/api/v1
```

## 🔧 Troubleshooting

### App não conecta no backend
1. ✅ Backend está rodando? `http://localhost:3000`
2. ✅ IP correto no `.env`?
3. ✅ Firewall liberado na porta 3000?
4. ✅ Celular na mesma rede WiFi?

### Testar Conexão
```bash
# No navegador do celular, acesse:
http://SEU_IP:3000/api/v1/instituicoes
```

### Logs do Expo
```bash
# Ver logs detalhados
npx expo start --dev-client

# Limpar cache
npx expo start --clear
```

## 📱 Comandos Úteis

```bash
# Iniciar no Android
npm run android

# Iniciar no iOS
npm run ios

# Iniciar na Web
npm run web

# Limpar cache e reiniciar
npx expo start --clear
```

## 🌐 Estrutura da API

O app consome os seguintes endpoints:

- `GET /api/v1/instituicoes` - Listar instituições
- `POST /api/v1/instituicoes` - Criar instituição
- `PUT /api/v1/instituicoes/:id` - Atualizar instituição
- `DELETE /api/v1/instituicoes/:id` - Remover instituição

E assim por diante para: cursos, professores, disciplinas, laboratórios e blocos.