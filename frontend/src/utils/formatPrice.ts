/**
 * @fileoverview Price formatting for display.
 * Layer: Utils — presentation formatting.
 * Notes:
 * - Converts both string and number input to compact currency text.
 */

/** Formats price as USD with locale-aware thousands separator. */
export function formatPrice(price: string | number): string {
    // Normalize to number and format with locale separators.
    return `$${Number(price).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}
