

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Layout from "../components/Layout/Layout";
import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Vacations from "../pages/Vacations/Vacations";
import VacationDetails from "../pages/VacationDetails/VacationDetails";
import Recommendations from "../pages/Recommendations/Recommendations";
import McpChat from "../pages/McpChat/McpChat";
import Profile from "../pages/Profile/Profile";
import About from "../pages/About/About";
import NotFound from "../pages/NotFound/NotFound";
import AdminVacations from "../pages/admin/AdminVacations/AdminVacations";
import VacationForm from "../pages/admin/VacationForm/VacationForm";
import Reports from "../pages/admin/Reports/Reports";
import { ROUTES } from "../config/appConfig";


function AppRoutes() {
  return (
    <Routes>
      {}
      <Route path={ROUTES.root} element={<Landing />} />
      <Route path={ROUTES.login} element={<Login />} />
      <Route path={ROUTES.register} element={<Register />} />
      <Route path={ROUTES.about} element={<About />} />

      {}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path={ROUTES.vacations} element={<Vacations />} />
          <Route path={ROUTES.vacationDetails} element={<VacationDetails />} />
          <Route path={ROUTES.recommendations} element={<Recommendations />} />
          <Route path={ROUTES.mcp} element={<McpChat />} />
          <Route path={ROUTES.profile} element={<Profile />} />

          {}
          <Route element={<AdminRoute />}>
            <Route path={ROUTES.adminVacations} element={<AdminVacations />} />
            <Route path={ROUTES.adminVacationNew} element={<VacationForm />} />
            <Route
              path={ROUTES.adminVacationEditPattern}
              element={<VacationForm />}
            />
            <Route path={ROUTES.adminReports} element={<Reports />} />
          </Route>
        </Route>
      </Route>

      {}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
