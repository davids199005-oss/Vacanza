


export function formatPrice(price: string | number): string {
    
    return `$${Number(price).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}
