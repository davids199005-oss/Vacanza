/**
 * @fileoverview Minimal navbar for unauthenticated pages (e.g. About).
 * Layer: Layout — logo-only header when user is not logged in.
 * Notes:
 * - Lightweight header without profile/actions.
 */

import { NavLink } from "react-router-dom";
import { Layout } from "antd";
import { ROUTES } from "../../config/constants";

const { Header } = Layout;

/** Minimal navbar with brand link. */
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

      {/* Intentionally minimal: only brand link is shown. */}
    </Header>
  );
}

export default SimpleNavbar;
