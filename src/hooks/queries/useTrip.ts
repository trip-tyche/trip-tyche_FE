import { useQuery } from '@tanstack/react-query';

import { tripAPI } from '@/api';

export const useTripTicketInfo = (tripId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['trip-ticket-info', tripId],
        queryFn: () => tripAPI.fetchTripTicketInfo(tripId),
        enabled,
        staleTime: 5 * 60 * 1000,
    });
};

export const useTripTicketList = () => {
    return useQuery({
        queryKey: ['trip-ticket-list'],
        queryFn: () => tripAPI.fetchTripTicketList(),
        // staleTime: 60 * 1000,
    });
};

export const useTripTimeline = (tripId: string) => {
    return useQuery({
        queryKey: ['trip-timeline', tripId],
        queryFn: () => tripAPI.fetchTripTimeline(tripId),
    });
};
