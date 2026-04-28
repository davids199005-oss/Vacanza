

import { VacationWithLikes } from "../models/Vacation";


export function exportToCsv(vacations: VacationWithLikes[]): void {
    
    const header = "Destination,Likes";
    
    const rows = vacations.map(v => `${v.destination},${v.likes}`);
    const csv = [header, ...rows].join("\n");

    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vacations_report.csv";
    
    link.click();
    
    URL.revokeObjectURL(url);
}
