# Use official Node.js image for building
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including devDependencies
RUN npm install --force

# Generate Prisma client
RUN npx prisma generate

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Create final production image
FROM node:22-alpine

# Install dependencies for Prisma and Postgres
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

# Copy runtime dependencies from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

RUN ls -l dist

# Expose application port
ENV PORT=3500
EXPOSE $PORT

# Migrate database and start application
CMD npx prisma migrate deploy && node dist/src/main.js