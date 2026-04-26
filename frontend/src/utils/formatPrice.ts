/**
 * @fileoverview Форматирование цены для отображения в UI.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Превращает строковое или числовое значение цены в человекочитаемую
 *   строку с символом доллара и разделителями тысяч (US-локаль).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Util (фронт). Используется в карточках вакаций и на странице деталей.
 *
 * Особенности:
 *   - Принимает string или number, потому что backend возвращает DECIMAL
 *     как строку (см. модель IVacation.price).
 */

/** Форматирует цену в USD с разделителями тысяч ("$2,500"). */
export function formatPrice(price: string | number): string {
    // Приводим значение к числу и форматируем через toLocaleString.
    return `$${Number(price).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}
