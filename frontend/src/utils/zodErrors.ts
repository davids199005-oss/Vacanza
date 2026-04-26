/**
 * @fileoverview Нормализация ошибок Zod в формат полей формы.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Преобразует ZodError в объект `{ fieldName: errorMessage }`, удобный
 *   для подстановки в стейт ошибок формы UI.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Util (фронт). Применяется в формах, которые валидируют ввод
 *   через Zod без react-hook-form, и хотят отображать ошибку у каждого поля.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Перебирает issues из ZodError.
 *   - Берёт первый сегмент path как имя поля.
 *   - Сохраняет ТОЛЬКО первое сообщение по каждому полю (чтобы не показывать
 *     несколько ошибок подряд для одного и того же ввода).
 */

import { ZodError } from "zod";

/** Карта ошибок формы: ключ поля → текст ошибки. */
export type FormErrors = Record<string, string>;

/** Извлекает первую ошибку каждого поля из `ZodError`. */
export function getZodErrors(error: ZodError): FormErrors {
    const errors: FormErrors = {};
    for (const issue of error.issues) {
        // Имя поля — верхний сегмент пути ошибки в Zod.
        const field = issue.path[0];
        if (field && !errors[field as string]) {
            // Сохраняем только первое сообщение для каждого поля.
            errors[field as string] = issue.message;
        }
    }
    return errors;
}
