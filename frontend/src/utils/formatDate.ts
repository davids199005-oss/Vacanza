


export function formatDate(dateStr: string): string {
    
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
