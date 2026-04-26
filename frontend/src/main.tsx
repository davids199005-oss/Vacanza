/**
 * @fileoverview Точка входа frontend-приложения.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Это самый первый скрипт SPA, который выполняет браузер. Здесь:
 *     1. Восстанавливается auth-состояние из localStorage (до первого рендера).
 *     2. Создаётся React-root и монтируется дерево с провайдерами:
 *        ConfigProvider (Ant Design тема) → Provider (Redux store) →
 *        BrowserRouter (роутер) → AppRoutes.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Bootstrap. Этот файл «склеивает» store, тему, роутер и компонент
 *   маршрутов в готовое приложение.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { store } from "./redux/Store";
import { theme } from "./ui/theme";
import { restoreSession } from "./utils/restoreSession";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

// Восстанавливаем auth-состояние ДО первого рендера, чтобы избежать
// «мигания» интерфейса (когда сначала рисуется страница для гостя,
// а потом — для авторизованного пользователя).
restoreSession(store);

// Монтируем приложение с темой, Redux Store и Router-провайдерами.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  </StrictMode>
);
