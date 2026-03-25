/**
 * @fileoverview Route guard for authenticated users.
 * Layer: Routing — redirects to login when unauthenticated.
 * Notes:
 * - Uses Redux token presence as authentication signal.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../redux/appState";

/** Renders children if token exists; otherwise redirects to /login. */
function ProtectedRoute() {
  // Read auth token from global state.
  const token = useSelector((state: AppState) => state.token);
  // Render nested route when authenticated, otherwise redirect.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
