/**
 * @fileoverview Date formatting for display.
 * Layer: Utils — presentation formatting (DD/MM/YYYY).
 * Notes:
 * - Pure formatting helper with no side effects.
 */

/** Formats date string as DD/MM/YYYY (en-GB locale). */
export function formatDate(dateStr: string): string {
    // Convert incoming date string into locale-formatted display value.
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
