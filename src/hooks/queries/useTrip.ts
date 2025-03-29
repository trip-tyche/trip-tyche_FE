import { useQuery } from '@tanstack/react-query';

import { tripAPI } from '@/api';

export const useTripTicketList = () => {
    return useQuery({
        queryKey: ['ticket-list'],
        queryFn: () => tripAPI.fetchTripTicketList(),
        select: (result) => {
            if (!result.isSuccess || !result.data) {
                throw new Error(result.error);
            }
            return result.data;
        },
    });
};

export const useTripTicketInfo = (tripId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['ticket-info', tripId],
        queryFn: () => tripAPI.fetchTripTicketInfo(tripId),
        enabled,
        staleTime: 5 * 60 * 1000,
    });
};

export const useTripTimeline = (tripId: string) => {
    return useQuery({
        queryKey: ['trip-timeline', tripId],
        queryFn: () => tripAPI.fetchTripTimeline(tripId),
    });
};
