FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files and workspace config
COPY package*.json ./
COPY turbo.json ./

# Copy all package.json files for dependency resolution
COPY packages/database/package*.json ./packages/database/
COPY packages/eslint-config/package*.json ./packages/eslint-config/
COPY apps/frontend/package*.json ./apps/frontend/

# Copy Prisma schema first (needed for database package postinstall)
COPY packages/database/prisma ./packages/database/prisma

# Install all dependencies (needed for monorepo with shared packages)
RUN npm ci

# Copy source code for all packages (needed for turbo build)
COPY packages/ ./packages/
COPY apps/frontend ./apps/frontend/

# Set working directory to frontend
WORKDIR /app/apps/frontend

# Set production API URL (can be overridden at build time)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/frontend.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]