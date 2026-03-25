/**
 * @fileoverview Route guard for admin-only pages.
 * Layer: Routing — redirects non-admins to /vacations.
 * Notes:
 * - Client-side guard improves UX; backend still enforces real security.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../redux/appState";
import { Role } from "../models/role";

/** Renders children if user is admin; otherwise redirects to /vacations. */
function AdminRoute() {
  // Read authenticated user from global state.
  const user = useSelector((state: AppState) => state.user);
  // Render nested route only for admin users.
  return user?.role === Role.ADMIN ? (
    <Outlet />
  ) : (
    <Navigate to="/vacations" replace />
  );
}

export default AdminRoute;
