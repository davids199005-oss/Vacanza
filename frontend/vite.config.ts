// Назначение файла: конфигурация сборки и dev-сервера Vite для frontend.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  // Подключаем React-плагин на базе SWC для быстрой сборки.
  plugins: [react()],
  server: {
    // Не открывать браузер автоматически при старте dev-сервера.
    open: false,
    // Слушать все интерфейсы (удобно для Docker/LAN).
    host: true,
  },
})