/**
 * @fileoverview App entry point.
 * Layer: Bootstrap — mounts React app, restores session, providers.
 * Notes:
 * - Session is restored before first render to avoid auth flicker.
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

// Restore auth state before mounting the app.
restoreSession(store);

// Mount app with theme, Redux store, and router providers.
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
