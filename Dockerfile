# Етап 1: Збірка (Build)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

# Етап 2: Запуск (Run)
FROM nginx:alpine
# Встановлюємо wget для healthcheck
RUN apk add --no-cache wget
# Копіюємо білд
COPY --from=builder /app/dist /usr/share/nginx/html
# Копіюємо наш кастомний конфіг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]