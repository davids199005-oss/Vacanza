/**
 * @fileoverview Загрузка и валидация переменных окружения через Zod.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Подгружает значения из `.env`, проверяет их на соответствие строгой схеме и
 *   экспортирует типобезопасный объект `env`, которым пользуются все остальные модули.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Config. Это «контракт окружения» приложения: если хоть одна переменная
 *   отсутствует или имеет неверный тип — процесс падает на старте с понятной ошибкой,
 *   что предотвращает скрытые баги в рантайме.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   1. Через `dotenv` подгружает значения из файла `.env` в `process.env`.
 *   2. Описывает Zod-схему ожидаемых переменных (PORT, MySQL-параметры, JWT-секрет,
 *      ключ OpenAI, URL MCP-сервера, режим NODE_ENV, опциональный CORS_ORIGIN).
 *   3. Выполняет `safeParse(process.env)` — при ошибке выводит сообщение и завершает
 *      процесс с кодом 1.
 *   4. Сохраняет распарсенные и приведённые к типам значения в экспортируемый `env`.
 */

import { z } from "zod";
import dotenv from "dotenv";

// Загружаем переменные из файла `.env` в `process.env`.
// Параметр `quiet: true` отключает шумное логирование dotenv в stdout.
dotenv.config({ quiet: true });

// Центральная схема, описывающая все обязательные параметры конфигурации в рантайме.
const envSchema = z.object({
    PORT: z.coerce.number(),
    MYSQL_HOST: z.string(),
    MYSQL_PORT: z.coerce.number(),
    MYSQL_USER: z.string(),
    MYSQL_PASSWORD: z.string(),
    MYSQL_DATABASE: z.string(),
    JWT_SECRET: z.string().min(10, "JWT secret is required"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    OPENAI_API_KEY: z.string().min(1, "OpenAI API key is required"),
    MCP_SERVER_URL: z.url({ message: "MCP server URL must be a valid URL" }),
    // Необязательное поле: список разрешённых источников CORS (через запятую).
    // По умолчанию используется http://localhost:5173 в dev и http://localhost в production.
    // Значение "*" разрешает любые источники (не рекомендуется для production).
    CORS_ORIGIN: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

// Внутренний контейнер для распарсенных переменных. Заполняется в `validateEnv()`.
let env: Env = {} as Env;

/**
 * Проверяет переменные окружения по схеме.
 * При неуспешной валидации завершает процесс с кодом 1, чтобы приложение
 * не продолжило работу в заведомо некорректной конфигурации.
 */
export function validateEnv(): void {
    // Валидируем переменные через safeParse, чтобы не бросать исключение,
    // а получить структурированный результат и красиво его залогировать.
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        // Логируем человекочитаемую ошибку и убиваем процесс — без валидной
        // конфигурации запускать сервер бессмысленно.
        console.error("Invalid environment variables ❌:", result.error.message);
        process.exit(1);
    }
    // Сохраняем распарсенные значения (числа уже приведены, defaults применены).
    env = result.data;
    console.log("Environment variables validated successfully ✅");
}

// Запускаем валидацию однократно при инициализации модуля,
// чтобы любой импортирующий получил уже готовый объект `env`.
validateEnv();

export { env };
