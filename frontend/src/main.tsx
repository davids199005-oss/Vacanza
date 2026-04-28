

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

// Restore auth/session state before mounting the app tree.
restoreSession(store);


// Compose global providers once at the application entry point.
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
