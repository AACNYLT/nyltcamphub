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