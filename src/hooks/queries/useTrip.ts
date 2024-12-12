import { useQuery } from '@tanstack/react-query';

import { tripAPI } from '@/api';

export const useTripTicketInfo = (tripId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['trip-ticket-info', tripId],
        queryFn: () => tripAPI.fetchTripTicketInfo(tripId),
        enabled,
    });
};

export const useTripTicketList = () => {
    return useQuery({
        queryKey: ['trip-ticket-list'],
        queryFn: () => tripAPI.fetchTripTicketList(),
    });
};

export const useTripTimeline = (tripId: string) => {
    return useQuery({
        queryKey: ['trip-timeline', tripId],
        queryFn: () => tripAPI.fetchTripTimeline(tripId),
    });
};
