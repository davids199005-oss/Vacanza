

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../redux/AppState";
import { Role } from "../models/Role";


function AdminRoute() {
  
  const user = useSelector((state: AppState) => state.user);
  
  return user?.role === Role.ADMIN ? (
    <Outlet />
  ) : (
    <Navigate to="/vacations" replace />
  );
}

export default AdminRoute;
