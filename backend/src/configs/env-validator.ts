

import { z } from "zod";
import dotenv from "dotenv";



dotenv.config({ quiet: true });


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
    
    
    
    CORS_ORIGIN: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;


let env: Env = {} as Env;


export function validateEnv(): void {
    
    
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        
        
        console.error("Invalid environment variables ❌:", result.error.message);
        process.exit(1);
    }
    
    env = result.data;
    console.log("Environment variables validated successfully ✅");
}



validateEnv();

export { env };
