/**
 * @fileoverview Guard для защищённых маршрутов SPA.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Оборачивает группу маршрутов, доступных только авторизованным
 *   пользователям. Если в Redux нет токена — редиректит на /login.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Routes (фронт). Используется в AppRoutes как «зонтик» над всеми
 *   приватными страницами (Vacations, Profile, Recommendations и т.д.).
 *
 * Замечание: токен здесь не валидируется, проверяется лишь его наличие
 * в state. Полную проверку выполняет axios-инстанс (через 401-интерсептор)
 * и backend (через authMiddleware).
 */

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../redux/AppState";

/** Отрисовывает вложенный маршрут только для авторизованных пользователей. */
function ProtectedRoute() {
  // Берём токен из глобального state Redux.
  const token = useSelector((state: AppState) => state.token);
  // При наличии токена — пропускаем, иначе — редиректим на страницу входа.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
