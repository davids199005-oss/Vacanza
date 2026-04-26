/**
 * @fileoverview Форматирование даты для отображения в интерфейсе.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Один маленький хелпер, который превращает строковую дату из backend
 *   в человекочитаемый формат DD/MM/YYYY (локаль en-GB).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Util (фронт). Используется в карточках вакаций, на странице
 *   деталей и в админских формах.
 */

/** Форматирует дату в вид DD/MM/YYYY (локаль en-GB). */
export function formatDate(dateStr: string): string {
    // Преобразуем строку даты в локализованный формат.
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
