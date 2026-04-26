/**
 * @fileoverview Общий футер приложения.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Отрисовывает нижнюю часть страницы с брендом, ссылкой "About" и
 *   копирайтом. Использует общий стиль (glass surface) и Framer Motion
 *   для плавного появления.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Components. Подключается в Layout под Content и появляется на
 *   всех защищённых страницах SPA.
 */

import { Layout, Typography } from "antd";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../../ui/motion";
import { ROUTES } from "../../config/appConfig";

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

/** Футер: бренд, ссылка About и копирайт. */
function Footer() {
  return (
    <AntFooter
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
        padding: "24px",
        borderTop: "1px solid var(--border-soft)",
        textAlign: "center",
        background: "var(--bg-surface)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Основной контент футера: бренд, ссылка About и атрибуция автора. */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontSize: 14,
          color: "var(--text-secondary)",
        }}
      >
        <Text strong style={{ color: "var(--text-primary)" }}>
          Vacanza
        </Text>
        <Text style={{ color: "var(--text-secondary)" }}>|</Text>
        <NavLink
          to={ROUTES.about}
          style={{ color: "var(--link-accent)", textDecoration: "none" }}
        >
          About
        </NavLink>
        <Text style={{ color: "var(--text-secondary)" }}>|</Text>
        <Text style={{ color: "var(--text-secondary)" }}>
          Copyright Created by{" "}
          <a
            href="https://github.com/davids199005-oss"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--link-accent)" }}
          >
            David Veryutin
          </a>{" "}
          &copy; {new Date().getFullYear()} Vacanza. All rights reserved.
        </Text>
      </motion.div>
    </AntFooter>
  );
}

export default Footer;
