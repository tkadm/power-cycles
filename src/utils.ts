export function DateCopy(source: Date, offset_days: number): Date {
    let result: Date = new Date(source.valueOf());
    result.setDate(result.getDate() + offset_days);
    return result;
}

export function DateTrunc(source: Date): Date {
    return new Date(source.getFullYear(), source.getMonth(),
        source.getDate());
}

export function DaysBetween(earlier: Date, later: Date): number {
    return (later.valueOf() - earlier.valueOf()) / (24 * 60 * 60 * 1000);
}