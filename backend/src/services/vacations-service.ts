/**
 * @fileoverview Сервис вакаций (CRUD + лайки + чистка изображений).
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Реализует все операции над сущностью «отпуск»:
 *     - чтение списка вакаций с агрегатом лайков и флагом isLiked;
 *     - добавление, обновление и удаление вакации;
 *     - постановка/снятие лайка пользователем;
 *     - удаление файлов изображений с диска при удалении/замене.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Service. Вызывается vacations-controller. Не знает про HTTP-уровень.
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - getAllVacations(userId) — один запрос с LEFT JOIN на likes, считает
 *     общее количество лайков и флаг isLiked для текущего пользователя.
 *   - addVacation/updateVacation — нормализуют даты в формат ISO YYYY-MM-DD
 *     для совместимости с MySQL DATE.
 *   - deleteVacation — удаляет запись из БД и (best-effort) файл изображения.
 *   - addLike — использует INSERT IGNORE, чтобы повторный лайк не падал
 *     с ошибкой уникальности.
 *   - removeLike — DELETE по паре (user_id, vacation_id).
 */

import { db } from "../configs/db-config.ts";
import { AddVacationSchema, UpdateVacationSchema } from "../schemas/vacations-schema.ts";
import { IVacation, VacationWithLikes } from "../models/vacations-model.ts";
import { NotFoundError } from "../errors/base-errors.ts";
import { ResultSetHeader } from "mysql2";
import { mapVacation, RawVacation } from "../utils/map-vacations-util.ts";
import fs from "fs/promises";
import path from "path";

class VacationsService {

  /** Возвращает все вакации с числом лайков и флагом isLiked для пользователя. */
  public async getAllVacations(userId: number): Promise<VacationWithLikes[]> {
    // Один SQL-запрос: агрегируем likes и флаг isLiked, чтобы избежать N+1.
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

  /** Добавляет вакацию с уже сохранённым на диск именем файла изображения. */
  public async addVacation(dto: AddVacationSchema, imageName: string): Promise<IVacation> {
    // Сохраняем только дату (без времени) — это совпадает с типом DATE в SQL.
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

  /** Обновляет вакацию; если новое изображение не передано — оставляет прежнее. */
  public async updateVacation(id: number, dto: UpdateVacationSchema, imageName?: string): Promise<IVacation> {
    // Читаем текущую запись, чтобы при отсутствии нового файла оставить старый image.
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
    // Если изображение реально заменилось — удаляем старый файл с диска.
    if (imageName && imageName !== existing.image) {
      const oldpath = path.join(process.cwd(), "assets/images/vacations", existing.image);
      await fs.unlink(oldpath).catch(() => {}); // Игнорируем, если файла уже нет.
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

  /** Удаляет вакацию из БД и связанный файл изображения. */
  public async deleteVacation(id: number): Promise<void> {
    // До удаления из БД сохраняем имя файла, чтобы потом удалить его с диска.
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
    // Best-effort удаление файла: его отсутствие не должно валить эндпоинт.
    const imagePath = path.join(process.cwd(), 'assets/images/vacations', existing.image);
    await fs.unlink(imagePath).catch(() => {}); // Игнорируем, если файла уже нет.
  }

  /** Ставит лайк; INSERT IGNORE предотвращает дубль на уникальном индексе. */
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

  /** Снимает лайк (если его не было — DELETE просто отработает «вхолостую»). */
  public async removeLike(userId: number, vacationId: number): Promise<void> {
    await db.execute(
      'DELETE FROM likes WHERE user_id = ? AND vacation_id = ?',
      [userId, vacationId]
    );
  }
}

export const vacationsService = new VacationsService();
