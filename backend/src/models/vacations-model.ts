/**
 * @fileoverview Vacation domain models.
 * Layer: Domain — interfaces for vacation entities and like counts.
 * Notes:
 * - `IVacation` is the core vacation entity used across API layers.
 * - `VacationWithLikes` extends core entity with social metadata.
 */

export interface IVacation {
    // Database primary key.
    id: number;
    // Destination title shown in cards/lists.
    destination: string;
    // Human-readable trip description.
    description: string;
    // Vacation start date.
    startDate: Date;
    // Vacation end date.
    endDate: Date;
    // Decimal price serialized as string from MySQL driver.
    price: string; // MySQL DECIMAL is returned as a string, e.g. "2500.00"
    // Uploaded vacation image filename.
    image: string;
}

/** Vacation with like count and current user's like status. */
export interface VacationWithLikes extends IVacation {
    // Total number of likes from all users.
    likes: number;
    // Whether currently authenticated user liked this vacation.
    isLiked: boolean;
}