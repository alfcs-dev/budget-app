FROM node:18-alpine

WORKDIR /app

# Copy root package files (for monorepo)
COPY package*.json ./

# Copy backend package files  
COPY apps/backend/package*.json ./apps/backend/

# Install all dependencies (needed for monorepo)
RUN npm install

# Copy backend source code
COPY apps/backend ./apps/backend/

# Set working directory to backend
WORKDIR /app/apps/backend

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]