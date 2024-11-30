import { tripAPI } from '@/api';

export const updateTripDate = async (tripId: string, datesOfImages: string[]) => {
    if (!tripId) {
        return;
    }
    const tripInfoWithTripId = await tripAPI.fetchTripTicketInfo(tripId);
    const { tripId: _, ...tripInfo } = tripInfoWithTripId;
    const { startDate, endDate } = tripInfo;

    const sortedDates = datesOfImages.sort((a, b) => a.localeCompare(b));
    const [earliestNewDate, latestNewDate] = [sortedDates[0], sortedDates[sortedDates.length - 1]];

    const newStartDate = earliestNewDate.localeCompare(startDate) < 0 ? earliestNewDate : startDate;
    const newEndDate = earliestNewDate.localeCompare(startDate) > 0 ? latestNewDate : endDate;

    if (newStartDate !== startDate || newEndDate !== endDate) {
        await tripAPI.updateTripInfo(tripId, {
            ...tripInfo,
            startDate: newStartDate,
            endDate: newEndDate,
        });
    }
};
