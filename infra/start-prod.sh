#!/bin/bash

echo "🚀 Iniciando LabManager em modo produção..."

# Carrega variáveis de ambiente (filtra comentários)
export $(cat .env.prod | grep -v '^#' | xargs)

# Para os containers se estiverem rodando
docker compose -f docker-compose.prod.yml down

# Inicia os containers
docker compose -f docker-compose.prod.yml up --build -d

echo "✅ Serviços iniciados em produção:"
echo "   🌐 Aplicação: http://localhost"
echo ""
echo "📋 Para ver os logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"