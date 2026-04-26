/**
 * @fileoverview Guard для маршрутов, доступных только администратору.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Оборачивает админские маршруты и пропускает дальше только пользователей
 *   с ролью admin. Остальных редиректит на /vacations.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Routes (фронт). Используется в AppRoutes как обёртка над группой
 *   /admin/* маршрутов.
 *
 * ВАЖНО: это клиентский guard для UX. Реальная защита от не-админов
 * по-прежнему лежит на сервере (adminMiddleware) — клиентскую проверку
 * можно обойти, но ни один защищённый запрос не пройдёт без серверной.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../redux/AppState";
import { Role } from "../models/Role";

/** Пропускает во вложенный маршрут только пользователя с ролью admin. */
function AdminRoute() {
  // Берём текущего пользователя из Redux-состояния.
  const user = useSelector((state: AppState) => state.user);
  // Клиентский guard для UX; серверная проверка прав остаётся обязательной.
  return user?.role === Role.ADMIN ? (
    <Outlet />
  ) : (
    <Navigate to="/vacations" replace />
  );
}

export default AdminRoute;
