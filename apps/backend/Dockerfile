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

# Build database package first, then backend
RUN npm run build --filter=@budget-manager/database
WORKDIR /app/apps/backend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

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