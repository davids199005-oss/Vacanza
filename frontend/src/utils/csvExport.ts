/**
 * @fileoverview Утилита экспорта отчёта по вакациям в CSV.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Преобразует массив объектов VacationWithLikes в CSV-строку
 *   с двумя колонками (destination, likes) и инициирует скачивание
 *   полученного файла прямо из браузера.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Util (фронт). Используется на админской странице отчётов.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Формирует строки CSV (заголовок + строки данных).
 *   - Создаёт Blob с MIME-типом text/csv.
 *   - Создаёт временный <a href="blob:..."> и программно «кликает» по нему,
 *     запуская скачивание файла под именем `vacations_report.csv`.
 *   - Освобождает object URL после клика, чтобы не утекала память.
 */

import { VacationWithLikes } from "../models/Vacation";

/** Экспортирует вакации (destination, likes) в скачиваемый CSV-файл. */
export function exportToCsv(vacations: VacationWithLikes[]): void {
    // Сборка CSV: заголовок + строки.
    const header = "Destination,Likes";
    // Каждая вакация превращается в одну строку CSV.
    const rows = vacations.map(v => `${v.destination},${v.likes}`);
    const csv = [header, ...rows].join("\n");

    // Скачивание: создаём Blob, временную ссылку и инициируем загрузку.
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vacations_report.csv";
    // Программный клик по ссылке запускает скачивание у пользователя.
    link.click();
    // Освобождаем временный object URL (иначе утечёт память браузера).
    URL.revokeObjectURL(url);
}
