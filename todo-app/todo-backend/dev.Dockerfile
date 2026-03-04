# ========================================
# Base
# ========================================
ARG NODE_VERSION=24
FROM node:${NODE_VERSION} AS base

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

# ========================================
# Build Dependecies Stage
# ========================================
FROM base AS build-deps

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --no-audit --no-fund && \
    npm cache clean --force

RUN chown -R node:node /usr/src/app

# ========================================
# Development Stage
# ========================================
FROM build-deps AS development

COPY . .

RUN chown -R node:node /usr/src/app && \
    chown -R 755 /usr/src/app

USER node

EXPOSE 3000

CMD ["npm", "run", "dev"]
