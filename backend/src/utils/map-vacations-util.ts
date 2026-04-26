/**
 * @fileoverview Маппинг vacation-строк из БД в доменную модель VacationWithLikes.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Преобразует «сырой» результат SQL-запроса в готовый объект для отдачи в API.
 *   Особенно полезно потому, что MySQL-драйвер возвращает DECIMAL и COUNT() как
 *   строки, а даты — как ISO-строки.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Util. Применяется в vacations-service после выполнения JOIN-запросов
 *   с подсчётом лайков и проверкой, лайкал ли текущий пользователь.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - RawVacation     — описывает структуру «сырой» строки.
 *   - mapVacation()   — приводит типы:
 *       * startDate/endDate (string → Date);
 *       * likes (string → number, т.к. COUNT() возвращает строку);
 *       * isLiked (0/1 → boolean);
 *       * price оставляем строкой, чтобы не потерять точность DECIMAL.
 */

import type { VacationWithLikes } from "../models/vacations-model.ts";

/** Сырое представление строки из vacations-запроса (DECIMAL/COUNT как строки). */
export interface RawVacation {
  // Первичный ключ вакации.
  id: number;
  // Название направления.
  destination: string;
  // Текст описания.
  description: string;
  // Дата начала в виде строки (alias из SQL).
  startDate: string;
  // Дата окончания в виде строки (alias из SQL).
  endDate: string;
  price: string; // MySQL DECIMAL приходит строкой — сохраняем точность.
  // Имя файла изображения.
  image: string;
  likes: string; // COUNT() в MySQL всегда возвращается строкой.
  // Результат CASE из SQL (0/1) — лайкнул ли текущий пользователь.
  isLiked: 0 | 1;
}

/** Конвертирует строку БД в VacationWithLikes: даты, число лайков, флаг isLiked. */
export function mapVacation(vacation: RawVacation): VacationWithLikes {
  // Приводим примитивы из БД к доменным типам, ожидаемым на фронте.
  return {
    id: vacation.id,
    destination: vacation.destination,
    description: vacation.description,
    startDate: new Date(vacation.startDate),
    endDate: new Date(vacation.endDate),
    price: vacation.price,           // Оставляем строкой (MySQL DECIMAL).
    image: vacation.image,
    likes: Number(vacation.likes),   // COUNT() возвращает строку — конвертируем в number.
    isLiked: vacation.isLiked === 1,
  };
}
