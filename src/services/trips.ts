import { tripAPI } from '@/api';

export const updateTripDate = async (tripKey: string, datesOfImages: string[]) => {
    // if (!tripKey) {
    //     return;
    // }
    // const tripInfoWithTripKey = await tripAPI.fetchTripTicketInfo(tripKey);
    // const { tripKey: _, ...tripInfo } = tripInfoWithTripKey;
    // const { startDate, endDate } = tripInfo;
    // const sortedDates = datesOfImages.sort((a, b) => a.localeCompare(b));
    // const [earliestNewDate, latestNewDate] = [sortedDates[0], sortedDates[sortedDates.length - 1]];
    // const newStartDate = earliestNewDate.localeCompare(startDate) < 0 ? earliestNewDate : startDate;
    // const newEndDate = earliestNewDate.localeCompare(startDate) > 0 ? latestNewDate : endDate;
    // if (newStartDate !== startDate || newEndDate !== endDate) {
    //     await tripAPI.updateTripTicketInfo(tripKey, {
    //         ...tripInfo,
    //         startDate: newStartDate,
    //         endDate: newEndDate,
    //     });
    // }
};
