

import { useState, useEffect, type CSSProperties } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Button, Avatar, Space, Typography } from "antd";
import { motion } from "framer-motion";
import { AppState } from "../../redux/AppState";
import { userSlice } from "../../redux/UserSlice";
import { tokenSlice } from "../../redux/TokenSlice";
import { vacationsSlice } from "../../redux/VacationsSlice";
import { usersApi } from "../../api/usersApi";
import { Role } from "../../models/Role";
import {
  AVATAR_BASE_URL,
  ROUTES,
  TOKEN_STORAGE_KEY,
} from "../../config/appConfig";
import { buttonHover, buttonTap, fadeIn } from "../../ui/motion";

const { Header } = Layout;
const { Text } = Typography;


function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: AppState) => state.user);
  const isAdmin = user?.role === Role.ADMIN;
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    
    usersApi
      .getProfile()
      .then((res) => setAvatar(res.data.avatar))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    
    dispatch(userSlice.actions.logoutUser());
    dispatch(tokenSlice.actions.logoutToken());
    dispatch(vacationsSlice.actions.clearVacations());
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    navigate(ROUTES.login);
  };

  
  const navLinks = [
    { to: ROUTES.vacations, label: "Vacations" },
    { to: ROUTES.recommendations, label: "AI Recommendations" },
    { to: ROUTES.mcp, label: "MCP Chat" },
    ...(isAdmin
      ? [
          { to: ROUTES.adminVacations, label: "Manage Vacations" },
          { to: ROUTES.adminReports, label: "Reports" },
        ]
      : []),
  ];

  
  const getNavLinkStyle = (isActive: boolean): CSSProperties => ({
    fontSize: 14,
    fontWeight: isActive ? 600 : 500,
    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 10,
    background: isActive ? "var(--status-upcoming-bg)" : "transparent",
    border: isActive
      ? "1px solid var(--border-accent)"
      : "1px solid transparent",
    transition: "all 0.2s ease",
  });

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
          color: "var(--text-primary)",
          textDecoration: "none",
        }}
      >
        <span className="accent-gradient-text">Vacanza</span>
      </NavLink>

      <Space size="large" style={{ flex: 1, justifyContent: "center" }}>
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => getNavLinkStyle(isActive)}
          >
            {label}
          </NavLink>
        ))}
      </Space>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        style={{ display: "flex", alignItems: "center", gap: 12 }}
      >
        <NavLink
          to={ROUTES.profile}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-primary)",
            textDecoration: "none",
            padding: "6px 10px",
            borderRadius: 12,
            border: "1px solid var(--border-soft)",
            background: "var(--bg-elevated)",
          }}
        >
          <Avatar
            size="small"
            src={avatar ? `${AVATAR_BASE_URL}/${avatar}` : undefined}
            style={{ fontSize: 12, backgroundColor: "var(--accent-solid)" }}
          >
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </Avatar>
          <Text
            strong
            style={{
              fontSize: 14,
              display: "inline",
              color: "var(--text-primary)",
            }}
          >
            {user?.firstName} {user?.lastName}
          </Text>
        </NavLink>
        <motion.div whileHover={buttonHover} whileTap={buttonTap}>
          <Button
            type="text"
            className="ghost-dark-button"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </motion.div>
      </motion.div>
    </Header>
  );
}

export default Navbar;
