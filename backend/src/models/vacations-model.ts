/**
 * @fileoverview Доменные модели отпусков (vacations).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Описывает базовую сущность IVacation и её расширение VacationWithLikes,
 *   которое уже включает социальные метаданные (число лайков и факт лайка
 *   текущим пользователем).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Domain. С IVacation работают CRUD-операции и mapper-утилиты,
 *   а VacationWithLikes возвращается публичным API списком вакаций.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - IVacation        — id, destination, description, даты, цена, image.
 *   - VacationWithLikes — IVacation + likes (агрегат) + isLiked (для текущего user).
 *
 * Особенность поля price: MySQL-драйвер возвращает DECIMAL как строку,
 * чтобы избежать потери точности — поэтому тип `string`, а не `number`.
 */

export interface IVacation {
    // Первичный ключ в таблице vacations.
    id: number;
    // Название направления — выводится в карточке/списке.
    destination: string;
    // Подробное описание поездки.
    description: string;
    // Дата начала отпуска.
    startDate: Date;
    // Дата окончания отпуска.
    endDate: Date;
    // Цена в виде строки — так MySQL-драйвер отдаёт DECIMAL без потери точности.
    price: string; // MySQL DECIMAL приходит как строка, например "2500.00".
    // Имя файла загруженного изображения вакации (хранится на диске).
    image: string;
}

/** Вакация с числом лайков и признаком лайка текущим пользователем. */
export interface VacationWithLikes extends IVacation {
    // Общее количество лайков от всех пользователей.
    likes: number;
    // Поставил ли лайк текущий аутентифицированный пользователь.
    isLiked: boolean;
}
