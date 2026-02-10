FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files and workspace config
COPY package*.json ./
COPY turbo.json ./

# Copy all package.json files for dependency resolution
COPY packages/database/package*.json ./packages/database/
COPY packages/eslint-config/package*.json ./packages/eslint-config/
COPY apps/backend/package*.json ./apps/backend/

# Copy Prisma schema first (needed for database package postinstall)
COPY packages/database/prisma ./packages/database/prisma

# Install all dependencies (needed for monorepo with shared packages)
RUN npm ci

# Copy source code for all packages (needed for turbo build)
COPY packages/ ./packages/
COPY apps/backend ./apps/backend/

# Ensure Prisma client is generated into root node_modules/.prisma
# (required at runtime when importing PrismaClient from @prisma/client)
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# Build with Turbo (same as local). Force run so Docker cache doesn’t skip the task.
ENV TURBO_FORCE=1
RUN npm run build --filter=@budget-manager/backend

# Show what was produced (for debugging)
RUN echo "=== backend dist contents ===" && ls -laR /app/apps/backend/dist 2>/dev/null || true

# Accept dist/main.js or dist/src/main.js (Nest can emit either depending on config)
RUN if [ -f /app/apps/backend/dist/main.js ]; then echo "OK: dist/main.js"; \
  elif [ -f /app/apps/backend/dist/src/main.js ]; then \
    cp -r /app/apps/backend/dist/src/. /app/apps/backend/dist/ && rm -rf /app/apps/backend/dist/src && echo "OK: normalized from dist/src/"; \
  else echo "ERROR: no main.js in dist or dist/src" && ls -laR /app/apps/backend/dist 2>/dev/null; exit 1; fi

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init and curl (for healthcheck)
RUN apk add --no-cache dumb-init curl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copy built application and full node_modules (monorepo hoists deps to root)
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
# Resolve workspace symlink @budget-manager/database -> ../../packages/database
COPY --from=builder --chown=nestjs:nodejs /app/packages/database ./packages/database

# Copy package.json for runtime dependencies
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/package*.json ./

# Copy Prisma schema for migrations
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/prisma ./prisma

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start the application with proper init system
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]