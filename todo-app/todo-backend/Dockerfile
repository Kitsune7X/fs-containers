# ========================================
# Base
# ========================================
ARG NODE_VERSION=24
FROM node:${NODE_VERSION} AS base

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

# ========================================
# Dependencies Stage
# ========================================
FROM base AS deps

COPY package*.json .

# Install only dependencies needed for production
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --omit=dev && \
    npm cache clean --force

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


# ========================================
# Build Stage
# ========================================
FROM build-deps AS build

COPY --chown=node:node . .

RUN npm run build

RUN chown -R node:node /usr/src/app

# ========================================
# Production Stage
# ========================================
ARG NODE_VERSION=24
FROM node:${NODE_VERSION} AS production

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

ENV NODE_ENV=production

# Copy production dependencies from deps stage
COPY --from=deps --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=deps --chown=node:node /usr/src/app/package*.json ./
COPY --chown=node:node . .
# RUN npm ci --only=production

USER node

EXPOSE 3000 

CMD ["npm", "start"]
