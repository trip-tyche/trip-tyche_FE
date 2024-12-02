export const calculateTripDay = (currentDate: string, startDate: string) => {
    if (!currentDate || !startDate) {
        return;
    }

    const current = new Date(currentDate).getTime();
    const start = new Date(startDate).getTime();

    const diffInTime = current - start;
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

    return `Day ${diffInDays + 1}`;
};
