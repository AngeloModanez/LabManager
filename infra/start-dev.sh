#!/bin/bash

echo "🚀 Iniciando LabManager em modo desenvolvimento..."

# Carrega variáveis de ambiente (filtra comentários)
export $(cat .env.dev | grep -v '^#' | xargs)

# Para os containers se estiverem rodando
docker compose -f docker-compose.dev.yml down

# Inicia os containers
docker compose -f docker-compose.dev.yml up --build -d

echo "✅ Serviços iniciados:"
echo "   📊 MongoDB: http://localhost:27017"
echo "   🔧 Backend API: http://localhost:3000"
echo "   🌐 Frontend: http://localhost:5173"
echo "   🐳 Portainer: http://localhost:9000"
echo ""
echo "📱 Para iniciar o mobile:"
echo "   cd ../mobile && npm start"
echo ""
echo "📋 Para ver os logs:"
echo "   docker-compose -f docker-compose.dev.yml logs -f"