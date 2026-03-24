/**
 * @fileoverview Maps raw DB vacation rows to domain models.
 * Layer: Util — converts snake_case, string dates, COUNT/like flags.
 * Notes:
 * - MySQL aggregates and DECIMAL values arrive as strings.
 * - Mapper normalizes to domain-friendly types.
 */

import type { VacationWithLikes } from "../models/vacations-model.ts";

/** Raw row shape from vacation queries (MySQL DECIMAL/COUNT as strings). */
export interface RawVacation {
  // Vacation primary key.
  id: number;
  // Destination title.
  destination: string;
  // Description text.
  description: string;
  // Start date string from SQL alias.
  startDate: string;
  // End date string from SQL alias.
  endDate: string;
  price: string; // MySQL DECIMAL is returned as a string
  // Image filename.
  image: string;
  likes: string; // COUNT() is always returned as a string
  // SQL CASE result (0/1) for current user like state.
  isLiked: 0 | 1;
}

/** Maps DB row to VacationWithLikes; converts dates, likes count, isLiked flag. */
export function mapVacation(vacation: RawVacation): VacationWithLikes {
  // Convert DB primitives into domain model fields expected by frontend.
  return {
    id: vacation.id,
    destination: vacation.destination,
    description: vacation.description,
    startDate: new Date(vacation.startDate),
    endDate: new Date(vacation.endDate),
    price: vacation.price,           // Keep as string (MySQL DECIMAL)
    image: vacation.image,
    likes: Number(vacation.likes),   // COUNT() returns string
    isLiked: vacation.isLiked === 1,
  };
}