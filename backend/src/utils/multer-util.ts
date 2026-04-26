/**
 * @fileoverview Конфигурация Multer для загрузки изображений.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Настраивает middleware для двух типов загрузок:
 *     - изображения вакаций (assets/images/vacations);
 *     - аватары пользователей (assets/images/avatars).
 *   Включает фильтр по MIME-типу (только JPEG/PNG/WEBP), лимит 5 МБ,
 *   уникальные имена файлов и автосоздание директорий при старте.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Util / инфраструктура. Используется в роутерах vacations и users
 *   как middleware перед контроллером.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Создаёт директории VACATIONS_DIR и AVATARS_DIR, если их нет.
 *   - Описывает fileFilter, отклоняющий любой не-image файл.
 *   - Генерирует уникальное имя по шаблону `<timestamp>-<random>.<ext>`.
 *   - Экспортирует два готовых middleware:
 *       * uploadVacationImage — поле формы "image";
 *       * uploadAvatar        — поле формы "avatar".
 *   - Экспортирует строку INVALID_IMAGE_FORMAT_ERROR — её ловит
 *     errorHandlerMiddleware, чтобы вернуть 400 при отказе фильтра.
 */

import fs from "fs";
import path from "path";
import multer from "multer";

const VACATIONS_DIR = path.join(process.cwd(), "assets/images/vacations");
const AVATARS_DIR = path.join(process.cwd(), "assets/images/avatars");

export const INVALID_IMAGE_FORMAT_ERROR = "Only JPEG, PNG, WEBP images are allowed";

/** Сопоставление MIME-типа и расширения файла. */
const MIME_TO_EXT: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

// Гарантируем, что директории для загрузок существуют (на старте).
if (!fs.existsSync(VACATIONS_DIR)) {
    fs.mkdirSync(VACATIONS_DIR, { recursive: true });
}
if (!fs.existsSync(AVATARS_DIR)) {
    fs.mkdirSync(AVATARS_DIR, { recursive: true });
}

/** Отклоняет не-изображения; пропускает только JPEG, PNG, WEBP. */
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (/^image\/(jpeg|png|webp)$/i.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(INVALID_IMAGE_FORMAT_ERROR));
    }
};

const generateFilename = (_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Используем timestamp + случайный суффикс, чтобы практически исключить коллизии имён.
    const ext = MIME_TO_EXT[file.mimetype] ?? ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
};

/** Хранилище для изображений вакаций (assets/images/vacations). */
const vacationStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, VACATIONS_DIR),
    filename: generateFilename,
});

/** Хранилище для аватаров (assets/images/avatars). */
const avatarStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, AVATARS_DIR),
    filename: generateFilename,
});

const limits = { fileSize: 5 * 1024 * 1024 }; // Лимит размера файла — 5 МБ.

/** Middleware Multer для изображений вакаций; имя поля формы — "image". */
export const uploadVacationImage = multer({
    storage: vacationStorage,
    limits,
    fileFilter,
}).single("image");

/** Middleware Multer для аватаров; имя поля формы — "avatar". */
export const uploadAvatar = multer({
    storage: avatarStorage,
    limits,
    fileFilter,
}).single("avatar");
