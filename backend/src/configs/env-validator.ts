/**
 * @fileoverview Environment variable validation and loading.
 * Layer: Config — validates required env vars at startup and exits on failure.
 * Notes:
 * - Any missing/invalid required variable stops app startup immediately.
 * - Exported `env` object is fully typed and safe for all modules.
 */

import { z } from "zod";
import dotenv from "dotenv";

// Load variables from `.env` into process.env.
dotenv.config({ quiet: true });

// Central schema describing all required runtime configuration.
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
    // Optional: comma-separated list of allowed CORS origins.
    // Defaults to localhost:5173 in dev and localhost:80 in production.
    // Set to "*" to allow all origins (not recommended for production).
    CORS_ORIGIN: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

let env: Env = {} as Env;

/**
 * Validates environment variables against the schema.
 * Exits the process with code 1 if validation fails.
 */
export function validateEnv(): void {
    // Validate all environment variables against strict schema.
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        // Log human-readable validation issue and stop process.
        console.error("Invalid environment variables ❌:", result.error.message);
        process.exit(1);
    }
    // Persist validated/parsed values (numbers coerced, defaults applied).
    env = result.data;
    console.log("Environment variables validated successfully ✅");
}
 
// Run validation once during module initialization.
validateEnv();

export { env };