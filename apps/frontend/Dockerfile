FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY apps/frontend/package*.json ./
COPY package*.json /root/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/frontend ./

# Set production API URL (can be overridden at build time)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/frontend.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]