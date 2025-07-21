FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files (for monorepo)
COPY package*.json ./

# Copy frontend package files
COPY apps/frontend/package*.json ./apps/frontend/

# Install all dependencies (needed for monorepo)
RUN npm install

# Copy frontend source code
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