# ──────────────────────
# 1) Build stage
# ──────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps, generate Prisma client, build your Nest app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# ──────────────────────
# 2) Runtime stage
# ──────────────────────
FROM node:18-alpine
WORKDIR /app

# Copy over only what we need
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist         /app/dist
COPY --from=builder /app/prisma       /app/prisma

EXPOSE 3000
CMD ["node", "dist/main"]
