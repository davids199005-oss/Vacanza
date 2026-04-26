/**
 * @fileoverview Доменные типы вакаций для всего фронтенда.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает три формы сущности «отпуск»:
 *     - IVacation         — базовая структура с фронтовыми типами полей;
 *     - VacationWithLikes — расширение с лайками для отображения списков;
 *     - VacationFormData  — структура данных формы добавления/редактирования.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Models. Используется API-клиентом, Redux-слайсом vacations,
 *   карточками и формами админки.
 *
 * Особенности типизации:
 *   - Даты приходят с backend строками — оставляем `string`, чтобы
 *     избежать повсеместного парсинга.
 *   - price — `string` потому, что backend возвращает MySQL DECIMAL как строку
 *     (точность важнее удобства арифметики).
 */

export interface IVacation {
    // Базовые поля карточки отпуска.
    id: number;
    // Название направления.
    destination: string;
    // Описание поездки.
    description: string;
    // Дата начала (ISO-строка или формат backend).
    startDate: string;
    // Дата окончания (ISO-строка или формат backend).
    endDate: string;
    // Цена строкой (MySQL DECIMAL → string).
    price: string;
    // Имя файла изображения вакации.
    image: string ;
}

export interface VacationWithLikes extends IVacation {
    // Социальные метрики: количество лайков и факт лайка текущим пользователем.
    likes: number;
    // Лайкнул ли текущий пользователь эту вакацию.
    isLiked: boolean;
}

export interface VacationFormData {
    // Поля формы добавления/редактирования вакации.
    destination: string;
    // Описание из формы.
    description: string;
    // Дата начала из формы (строка YYYY-MM-DD).
    startDate: string;
    // Дата окончания из формы.
    endDate: string;
    // Числовая цена из формы.
    price: number;
    // Опциональный загружаемый файл (при создании — обязателен по бизнес-правилам).
    image?: File;
}
