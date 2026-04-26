/**
 * @fileoverview Тип корневого Redux-состояния приложения.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает «форму» глобального state, который собирает Redux Store.
 *   Используется при типизации useSelector, чтобы во всех селекторах
 *   была одинаковая структура состояния.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой State Management. Это контракт между store и компонентами:
 *   состоит из трёх независимых сегментов (user, token, vacations),
 *   каждый из которых обслуживается своим slice'ом.
 */

import { IUser } from "../models/User";
import { VacationWithLikes } from "../models/Vacation";

export type AppState = {
    // Авторизация: данные текущего пользователя или null, если не авторизован.
    user: IUser | null;
    // Авторизация: активный JWT-токен (или null).
    token: string | null;
    // Данные: кеш отпусков с информацией о лайках.
    vacations: VacationWithLikes[];
};
