/**
 * @fileoverview Упрощённая шапка для публичных страниц (Login/Register/Landing).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Отрисовывает минимальный header с одной только ссылкой-брендом.
 *   Нет навигационных пунктов, нет блока пользователя — потому что эти
 *   страницы доступны и неавторизованным посетителям.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Components. Используется на страницах Auth и Landing.
 */

import { NavLink } from "react-router-dom";
import { Layout } from "antd";
import { ROUTES } from "../../config/appConfig";

const { Header } = Layout;

/** Минимальный navbar только с брендом. */
function SimpleNavbar() {
  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        lineHeight: "64px",
        paddingInline: 24,
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
        background: "var(--bg-surface)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border-soft)",
      }}
    >
      <NavLink
        to={ROUTES.vacations}
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          textDecoration: "none",
        }}
      >
        <span className="accent-gradient-text">Vacanza</span>
      </NavLink>

      {/* Намеренно минимально: только ссылка-бренд, без пунктов и user-блока. */}
    </Header>
  );
}

export default SimpleNavbar;
