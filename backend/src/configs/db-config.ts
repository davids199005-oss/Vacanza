/**
 * @fileoverview MySQL database connection pool.
 * Layer: Config — provides a shared pool for all DB operations.
 * Notes:
 * - Pool is created once and reused across services.
 * - All credentials come from validated `env`.
 */

import { env } from "./env-validator.ts";
import mysql from "mysql2/promise";



/** Shared MySQL connection pool. */
export const db = mysql.createPool({
  // Database host/IP.
  host: env.MYSQL_HOST,
  // Database TCP port.
  port: env.MYSQL_PORT,
  // Database user.
  user: env.MYSQL_USER,
  // Database password.
  password: env.MYSQL_PASSWORD,
  // Default schema/database name.
  database: env.MYSQL_DATABASE


});



async function waitForDb(retries = 12, delayMs = 2000): Promise<void> {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await db.getConnection();
      await conn.ping();
      conn.release();
      console.log("Database connected successfully ✅");
      return;
    } catch (error) {
      if (i === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export { waitForDb };