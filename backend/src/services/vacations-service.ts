

import { db } from "../configs/db-config.ts";
import { AddVacationSchema, UpdateVacationSchema } from "../schemas/vacations-schema.ts";
import { IVacation, VacationWithLikes } from "../models/vacations-model.ts";
import { NotFoundError } from "../errors/base-errors.ts";
import { ResultSetHeader } from "mysql2";
import { mapVacation, RawVacation } from "../utils/map-vacations-util.ts";
import fs from "fs/promises";
import path from "path";

class VacationsService {

  
  public async getAllVacations(userId: number): Promise<VacationWithLikes[]> {
    
    const [rows] = await db.execute(`
      SELECT
        v.id,
        v.destination,
        v.description,
        v.start_date AS startDate,
        v.end_date AS endDate,
        v.price,
        v.image,
        COUNT(l.user_id) AS likes,
        MAX(CASE WHEN l.user_id = ? THEN 1 ELSE 0 END) AS isLiked
      FROM vacations v
      LEFT JOIN likes l ON v.id = l.vacation_id
      GROUP BY v.id
      ORDER BY v.start_date ASC
    `, [userId]);
    return (rows as RawVacation[]).map(mapVacation);
  }

  
  public async addVacation(dto: AddVacationSchema, imageName: string): Promise<IVacation> {
    
    const startDate = dto.startDate.toISOString().split('T')[0];
    const endDate = dto.endDate.toISOString().split('T')[0];
    const [result] = await db.execute(`
      INSERT INTO vacations (destination, description, start_date, end_date, price, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [dto.destination, dto.description, startDate, endDate, dto.price, imageName]);

    const id = (result as ResultSetHeader).insertId;
    return {
      id,
      destination: dto.destination,
      description: dto.description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      price: dto.price.toString(),
      image: imageName,
    };
  }

  
  public async updateVacation(id: number, dto: UpdateVacationSchema, imageName?: string): Promise<IVacation> {
    
    const [rows] = await db.execute(
      'SELECT image FROM vacations WHERE id = ?', [id]
    );
    const existing = (rows as { image: string }[])[0];
    if (!existing) throw new NotFoundError('Vacation not found');

    const finalImageName = imageName ?? existing.image;
    const startDate = dto.startDate.toISOString().split('T')[0];
    const endDate = dto.endDate.toISOString().split('T')[0];

    await db.execute(`
      UPDATE vacations
      SET destination = ?, description = ?, start_date = ?, end_date = ?, price = ?, image = ?
      WHERE id = ?
    `, [dto.destination, dto.description, startDate, endDate, dto.price, finalImageName, id]);
    
    if (imageName && imageName !== existing.image) {
      const oldpath = path.join(process.cwd(), "assets/images/vacations", existing.image);
      await fs.unlink(oldpath).catch(() => {}); 
    }

    return {
      id,
      destination: dto.destination,
      description: dto.description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      price: dto.price.toString(),
      image: finalImageName,
    };
  }

  
  public async deleteVacation(id: number): Promise<void> {
    
    const [rows] = await db.execute(
      'SELECT image FROM vacations WHERE id = ?', [id]
    );
    const existing = (rows as { image: string }[])[0];
    if (!existing) throw new NotFoundError('Vacation image not found');


    const [result] = await db.execute(
      'DELETE FROM vacations WHERE id = ?', [id]
    );
    if ((result as ResultSetHeader).affectedRows === 0) {
      throw new NotFoundError('Vacation not found');
    }
    
    const imagePath = path.join(process.cwd(), 'assets/images/vacations', existing.image);
    await fs.unlink(imagePath).catch(() => {}); 
  }

  
  public async addLike(userId: number, vacationId: number): Promise<void> {
    const [rows] = await db.execute(
      'SELECT id FROM vacations WHERE id = ?', [vacationId]
    );
    if ((rows as { id: number }[]).length === 0) {
      throw new NotFoundError('Vacation not found');
    }
    await db.execute(
      'INSERT IGNORE INTO likes (user_id, vacation_id) VALUES (?, ?)',
      [userId, vacationId]
    );
  }

  
  public async removeLike(userId: number, vacationId: number): Promise<void> {
    await db.execute(
      'DELETE FROM likes WHERE user_id = ? AND vacation_id = ?',
      [userId, vacationId]
    );
  }
}

export const vacationsService = new VacationsService();
