/**
 * @fileoverview CSV export for vacation reports.
 * Layer: Utils — data export for admin reports.
 * Notes:
 * - Creates a temporary Blob URL and triggers browser download.
 */

import { VacationWithLikes } from "../models/vacation";

/** Exports vacations (destination, likes) to a downloadable CSV file. */
export function exportToCsv(vacations: VacationWithLikes[]): void {
    // CSV header row.
    const header = "Destination,Likes";
    // Convert each vacation to CSV line.
    const rows = vacations.map(v => `${v.destination},${v.likes}`);
    const csv = [header, ...rows].join("\n");

    // Build downloadable blob from CSV content.
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vacations_report.csv";
    // Programmatically click anchor to trigger file download.
    link.click();
    // Release object URL to avoid memory leaks.
    URL.revokeObjectURL(url);
}
