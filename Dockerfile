# Етап 1: Збірка (Build)
FROM node:18-alpine AS builder

WORKDIR /app

# ВАЖЛИВО: Використовуємо зірочку (*), щоб скопіювати і package.json, 
# і package-lock.json (якщо він існує). Це виправляє вашу помилку.
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь код проекту
COPY . .

# Збираємо проект
RUN npm run build

# Етап 2: Запуск (Run)
FROM nginx:alpine

# Копіюємо зібрані файли з папки dist (стандарт Vite) в Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Відкриваємо порт 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]