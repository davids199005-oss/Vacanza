/**
 * @fileoverview App route definitions.
 * Layer: Routing — public, protected, and admin route tree.
 * Notes:
 * - Route paths are centralized in `config/constants.ts`.
 */

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import AdminRoute from "./adminRoute";
import Layout from "../components/Layout/layout";
import Landing from "../pages/Landing/landing";
import Login from "../pages/Auth/login";
import Register from "../pages/Auth/register";
import Vacations from "../pages/Vacations/vacations";
import VacationDetails from "../pages/VacationDetails/vacationDetails";
import Recommendations from "../pages/Recommendations/recommendations";
import McpChat from "../pages/McpChat/mcpChat";
import Profile from "../pages/Profile/profile";
import About from "../pages/About/about";
import NotFound from "../pages/NotFound/notFound";
import AdminVacations from "../pages/Admin/AdminVacations/adminVacations";
import VacationForm from "../pages/Admin/VacationForm/vacationForm";
import Reports from "../pages/Admin/Reports/reports";
import { ROUTES } from "../config/appConfig";

/** Root route component with all app routes. */
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path={ROUTES.root} element={<Landing />} />
      <Route path={ROUTES.login} element={<Login />} />
      <Route path={ROUTES.register} element={<Register />} />
      <Route path={ROUTES.about} element={<About />} />

      {/* Protected area: requires auth token and uses shared app layout. */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path={ROUTES.vacations} element={<Vacations />} />
          <Route path={ROUTES.vacationDetails} element={<VacationDetails />} />
          <Route path={ROUTES.recommendations} element={<Recommendations />} />
          <Route path={ROUTES.mcp} element={<McpChat />} />
          <Route path={ROUTES.profile} element={<Profile />} />

          {/* Admin area: accessible only to users with admin role. */}
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

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
