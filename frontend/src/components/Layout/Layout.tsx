/**
 * @fileoverview Main app shell layout (navbar, content, footer).
 * Layer: Layout — shared layout for protected routes.
 * Notes:
 * - Wraps all authenticated pages under common chrome.
 */

import { Outlet } from "react-router-dom";
import { Layout as AntLayout } from "antd";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer";

const { Content } = AntLayout;

/** Layout with Navbar, Content, and Footer. */
function Layout() {
  return (
    // Shared shell used by nested protected routes.
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
