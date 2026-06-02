# ── Stage 1: build the React frontend ──────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.ts tsconfig*.json ./
COPY src ./src
COPY public ./public
COPY .env.production .env.production

RUN npm run build
# output → /app/dist


# ── Stage 2: build the Express backend ─────────────────────────────────────────
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend/tsconfig.json ./
COPY backend/src ./src

RUN npm run build
# output → /app/backend/dist


# ── Stage 3: lean production image ─────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Production-only backend deps
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# Backend compiled JS  →  /app/server/
COPY --from=backend-builder /app/backend/dist ./server

# Frontend built files →  /app/client/
COPY --from=frontend-builder /app/dist ./client

ENV NODE_ENV=production
EXPOSE 3001

# app.js resolves __dirname to /app/server, so ../client = /app/client
CMD ["node", "server/app.js"]
