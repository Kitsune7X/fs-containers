# ========================================
# Base
# ========================================
ARG NODE_VERSION=24
FROM node:${NODE_VERSION} AS base

WORKDIR /usr/src/app

# Create non-root user for security
RUN chown -R node:node /usr/src/app

# ========================================
# Build Dependencies Stage
# ========================================
FROM base AS build-deps

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --no-audit --no-fund && \
    npm cache clean --force

RUN chown -R node:node /usr/src/app

# ========================================
# Build Stage
# ========================================
FROM build-deps AS build-stage

COPY --chown=node:node . .

ENV VITE_BACKEND_URL=http://localhost:8080/api/

RUN npm run build

RUN chown -R node:node /usr/src/app

# ========================================
# Testing stage
# ========================================
FROM build-deps AS test

COPY --chown=node:node . .

RUN chown -R node:node /usr/src/app

CMD [ "npm", "run", "test" ]

# ========================================
# Production stage
# ========================================
FROM nginx:1.29-alpine AS production

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80