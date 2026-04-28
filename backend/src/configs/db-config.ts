

import { env } from "./env-validator.ts";
import mysql from "mysql2/promise";




export const db = mysql.createPool({
  
  host: env.MYSQL_HOST,
  
  port: env.MYSQL_PORT,
  
  user: env.MYSQL_USER,
  
  password: env.MYSQL_PASSWORD,
  
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
