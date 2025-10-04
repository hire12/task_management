#!/usr/bin/env bash
set -e

DOMAIN="orbit.pixel-mind.com"
REMOTE_HOST="s686.lon1.mysecurecloudhost.com"
REMOTE_USER="pixelmgj"
REMOTE_DIR="/home/pixelmgj/${DOMAIN}"
DB_NAME="pixelmgj_productivity"
DB_PASS="EIRk]hhbgM.c&xUv"
DB_PASS_ENCODED="EIRk%5DhhbgM.c%26xUv"

echo "=========================================="
echo "🚀 Deploying Orbit OS to https://${DOMAIN}"
echo "=========================================="

# 1. Clean and build Next.js locally
echo "📦 [1/4] Building Next.js application..."
rm -rf .next
npm run build

SSH_OPTS="-o ServerAliveInterval=30 -o ServerAliveCountMax=3 -o ConnectTimeout=15 -o StrictHostKeyChecking=no"

run_with_retry() {
  local max_attempts=5
  local attempt=1
  until "$@"; do
    if [ $attempt -ge $max_attempts ]; then
      echo "❌ Command failed after $attempt attempts."
      return 1
    fi
    echo "⚠️ Connection attempt $attempt failed. Retrying in 10s..."
    sleep 10
    attempt=$((attempt + 1))
  done
}

# 2. Upload files
echo "🌐 [2/4] Syncing application and dependencies to remote ${REMOTE_DIR}..."
run_with_retry rsync -avz -e "ssh $SSH_OPTS" \
  --exclude '.git' \
  --exclude '.next/cache' \
  --exclude '*.log' \
  --exclude 'legacy/**/node_modules' \
  --exclude 'legacy/client/node_modules' \
  --exclude 'legacy/server/node_modules' \
  ./ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/

# 3. Setup and start remote Node.js app
echo "⚙️  [3/4] Running production setup on cPanel..."
run_with_retry ssh $SSH_OPTS ${REMOTE_USER}@${REMOTE_HOST} "bash -s" << 'REMOTE_COMMANDS'
set -e
cd /home/pixelmgj/orbit.pixel-mind.com

# Initialize CloudLinux Node 22 environment if needed
if [ ! -d "/home/pixelmgj/nodevenv/orbit.pixel-mind.com/22" ]; then
  cloudlinux-selector create --json --interpreter nodejs --version 22 --app-root /home/pixelmgj/orbit.pixel-mind.com --domain orbit.pixel-mind.com --app-uri / --app-mode production --startup-file server.js 2>/dev/null || true
fi

# Configure production .env
cat << 'ENVFILE' > .env
DATABASE_URL="postgresql://pixelmgj_pixelmgj:EIRk%5DhhbgM.c%26xUv@127.0.0.1:5432/pixelmgj_productivity"
NEXT_PUBLIC_APP_URL="https://orbit.pixel-mind.com"
NODE_ENV="production"
PORT=3000
TOKIO_WORKER_THREADS=1
UV_THREADPOOL_SIZE=4
PRISMA_CLIENT_ENGINE_TYPE=library
ENVFILE

echo "🔄 Generating Prisma Client..."
npx prisma generate --schema=./prisma/schema.prisma 2>/dev/null || true

echo "🔄 Recycling LiteSpeed Passenger worker..."
mkdir -p tmp && touch tmp/restart.txt
pkill -f "lsnode:/home/pixelmgj/orbit.pixel-mind.com/" 2>/dev/null || true

echo "✅ Remote setup complete!"
REMOTE_COMMANDS

# 4. Verify deployment
echo "🔍 [4/4] Verifying HTTP response..."
sleep 4
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN} || echo "000")

echo "=========================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "Live URL: https://${DOMAIN} (HTTP ${HTTP_STATUS})"
echo "=========================================="
