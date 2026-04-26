# Базовый легковесный образ Node.js для backend-сервиса.
FROM node:24-alpine

# Рабочая директория внутри контейнера, где выполняется приложение.
WORKDIR /app

# Копируем только package.json для кэширования слоя npm install.
COPY ./backend/package.json /app

# Устанавливаем зависимости backend.
RUN npm install

# Копируем исходный код backend после установки зависимостей.
COPY ./backend /app

# Точка запуска backend-приложения (npm start).
ENTRYPOINT npm start