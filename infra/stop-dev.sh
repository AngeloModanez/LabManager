#!/bin/bash

echo "🛑 Parando LabManager..."

# Para todos os containers
docker compose -f docker-compose.dev.yml down

echo "✅ Todos os serviços foram parados."