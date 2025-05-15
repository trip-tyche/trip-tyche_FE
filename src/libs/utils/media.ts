export const addStartDateAndEndDateToImageDates = (
    tripStartDate: string,
    tripEndDate: string,
    imageDates: string[],
) => {
    const filteredDates = imageDates.filter((date: string) => date > tripStartDate && date < tripEndDate);
    return [tripStartDate, ...filteredDates, tripEndDate];
};
