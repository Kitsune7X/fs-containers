# ========================================
# Development Stage
# ========================================
ARG NODE_VERSION=24
FROM node:${NODE_VERSION}

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
