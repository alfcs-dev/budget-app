#!/usr/bin/env bash
# Run this on the server (e.g. via SSH) from the app directory: ./scripts/server-debug.sh
# Or: bash scripts/server-debug.sh

set -e
cd "$(dirname "$0")/.."
COMPOSE_FILE="${1:-docker-compose.subdomain.yml}"

echo "=========================================="
echo "Containers status (docker compose ps)"
echo "=========================================="
docker-compose -f "$COMPOSE_FILE" ps -a

echo ""
echo "=========================================="
echo "Backend logs (last 50 lines)"
echo "=========================================="
docker-compose -f "$COMPOSE_FILE" logs --tail=50 backend 2>&1 || true

echo ""
echo "=========================================="
echo "Frontend logs (last 30 lines)"
echo "=========================================="
docker-compose -f "$COMPOSE_FILE" logs --tail=30 frontend 2>&1 || true

echo ""
echo "=========================================="
echo "Postgres logs (last 20 lines)"
echo "=========================================="
docker-compose -f "$COMPOSE_FILE" logs --tail=20 postgres 2>&1 || true

echo ""
echo "=========================================="
echo "Local health checks"
echo "=========================================="
echo -n "Frontend (port 3010): "
curl -sf http://localhost:3010/health >/dev/null && echo "OK" || echo "FAIL"
echo -n "Backend (port 3011):  "
curl -sf http://localhost:3011/api/health >/dev/null && echo "OK" || echo "FAIL"

echo ""
echo "=========================================="
echo "Backend env (DATABASE_URL redacted)"
echo "=========================================="
docker-compose -f "$COMPOSE_FILE" exec -T backend env 2>/dev/null | grep -v DATABASE_URL || true
docker-compose -f "$COMPOSE_FILE" exec -T backend env 2>/dev/null | grep -q DATABASE_URL && echo "DATABASE_URL is set" || echo "DATABASE_URL not set"

echo ""
echo "=========================================="
echo "Done. Fix issues and re-run: docker-compose -f $COMPOSE_FILE up -d --build"
echo "=========================================="
