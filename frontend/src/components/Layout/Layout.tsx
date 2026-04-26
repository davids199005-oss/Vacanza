/**
 * @fileoverview Основной каркас интерфейса (navbar + content + footer).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Базовая обёртка для всех защищённых страниц SPA. Сверху рендерит
 *   Navbar, посередине — содержимое текущего вложенного маршрута через
 *   <Outlet />, снизу — Footer.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Components. Используется в AppRoutes как layout-компонент над
 *   ProtectedRoute. Все приватные страницы наследуют этот общий каркас.
 */

import { Outlet } from "react-router-dom";
import { Layout as AntLayout } from "antd";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const { Content } = AntLayout;

/** Layout с Navbar, Content и Footer. */
function Layout() {
  return (
    // Общий контейнер для вложенных защищённых маршрутов SPA.
    <AntLayout
      className="app-shell"
      style={{
        minHeight: "100vh",
        flexDirection: "column",
        background: "transparent",
      }}
    >
      <Navbar />
      <Content style={{ flex: 1, width: "100%" }}>
        <Outlet />
      </Content>
      <Footer />
    </AntLayout>
  );
}

export default Layout;
