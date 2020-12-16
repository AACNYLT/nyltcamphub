export function createQueryName(firstName: string, lastName: string): string {
    const queryName = firstName.toLowerCase() + lastName.toLowerCase();
    return queryName.trim().replace(' ', '');
}

export function createDate(dateString: string): Date {
    const date = new Date(dateString);
    date.setHours(0);
    date.setMinutes( 0 - date.getTimezoneOffset(), 0, 0);
    return date;
}