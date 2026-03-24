/**
 * @fileoverview Vacation domain models.
 * Layer: Domain — shared types for vacation entities across the app.
 * Notes:
 * - `VacationWithLikes` extends base vacation with social metadata.
 */

export interface IVacation {
    // Vacation primary identifier.
    id: number;
    // Destination label.
    destination: string;
    // Vacation description.
    description: string;
    // Start date string (ISO or backend-formatted).
    startDate: string;
    // End date string (ISO or backend-formatted).
    endDate: string;
    // Price string from backend DECIMAL.
    price: string;
    // Vacation image filename.
    image: string ;
}

export interface VacationWithLikes extends IVacation {
    // Total likes count.
    likes: number;
    // Whether current user liked this vacation.
    isLiked: boolean;
}

export interface VacationFormData {
    // Form destination value.
    destination: string;
    // Form description value.
    description: string;
    // Form start date string.
    startDate: string;
    // Form end date string.
    endDate: string;
    // Form numeric price value.
    price: number;
    // Optional uploaded image.
    image?: File;
}
