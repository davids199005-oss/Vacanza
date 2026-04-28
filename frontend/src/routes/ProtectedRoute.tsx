

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../redux/AppState";


function ProtectedRoute() {
  
  const token = useSelector((state: AppState) => state.token);
  
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
