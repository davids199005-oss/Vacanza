

import { Outlet } from "react-router-dom";
import { Layout as AntLayout } from "antd";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const { Content } = AntLayout;


function Layout() {
  return (
    
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
