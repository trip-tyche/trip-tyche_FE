export const getDays = (imageDates: string[]) =>
    imageDates.map((date, index) => {
        const isLastDate = index === imageDates.length - 1;
        return { date, dayNumber: calculateDay(imageDates[0], date, isLastDate) };
    });

const calculateDay = (firstDate: string, date: string, isLastDate: boolean) => {
    if (isLastDate) {
        return '귀국';
    }

    const startDateTime = new Date(firstDate).getTime();
    const dateTime = new Date(date).getTime();

    const diffInTime = dateTime - startDateTime;
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
    const firstIndex = diffInDays === 0;

    if (firstIndex) {
        return '출국';
    }

    return `Day ${diffInDays + 1}`;
};
