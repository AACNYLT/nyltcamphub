export function recommendationNumberToString(recommend: number): string {
    switch (recommend) {
        case 3:
            return 'Yes';
        case 2:
            return 'Maybe';
        case 1:
            return 'No';
        default:
            return 'N/A';
    }
}

export function removeTimezoneOffset(moment: any): Date {
    let date = moment.toDate();
    date.setHours(date.getHours() - (date.getTimezoneOffset() / 60))
    return date;
}