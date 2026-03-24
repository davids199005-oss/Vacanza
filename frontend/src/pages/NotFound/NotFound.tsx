/**
 * @fileoverview 404 fallback page.
 * Layer: Page — catch-all route for unknown paths.
 * Notes:
 * - Redirect target adapts to auth state.
 */

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Typography } from "antd";
import { motion } from "framer-motion";
import { AppState } from "../../redux/AppState";
import { ROUTES } from "../../config/constants";
import { buttonHover, buttonTap, fadeScale } from "../../ui/motion";

/** 404 page with contextual back link (vacations or login). */
function NotFound() {
  // If logged in, suggest returning to vacations; otherwise to login.
  const token = useSelector((state: AppState) => state.token);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <motion.div
        variants={fadeScale}
        initial="hidden"
        animate="visible"
        style={{ textAlign: "center", padding: 16 }}
      >
        <Typography.Title
          level={1}
          style={{
            fontSize: "10rem",
            lineHeight: 1,
            color: "var(--status-upcoming-bg)",
            marginBottom: -24,
          }}
        >
          404
        </Typography.Title>
        <Typography.Title level={2} style={{ marginBottom: 8, color: "var(--text-primary)" }}>
          Page not found
        </Typography.Title>
        <Typography.Text style={{ color: "var(--text-secondary)", display: "block", marginBottom: 32 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography.Text>
        <motion.div whileHover={buttonHover} whileTap={buttonTap}>
          <Button type="primary" size="large" className="primary-gradient-button" style={{ borderRadius: 9999, padding: "8px 32px" }}>
            <Link to={token ? ROUTES.vacations : ROUTES.login} style={{ color: "inherit" }}>
              {token ? "Back to Vacations" : "Go to Login"}
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound;
