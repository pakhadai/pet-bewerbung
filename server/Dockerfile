# server/Dockerfile
FROM node:18-alpine

# Встановлюємо wget для healthcheck
RUN apk add --no-cache wget

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4242

CMD ["node", "index.js"]