# server/Dockerfile
FROM node:18-alpine

# Встановлюємо wget для healthcheck
RUN apk add --no-cache wget

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4242

# Production environment
ENV NODE_ENV=production

USER node

CMD ["node", "index.js"]