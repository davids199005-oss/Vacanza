/**
 * @fileoverview Like domain model (user-vacation association).
 * Layer: Domain — represents a like record in the database.
 * Notes:
 * - One record means one user liked one vacation.
 * - Pair `(userId, vacationId)` should be unique at DB level.
 */

export interface ILike {
    // User foreign key.
    userId: number;
    // Vacation foreign key.
    vacationId: number;
}