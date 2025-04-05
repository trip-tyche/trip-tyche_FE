import { useQuery } from '@tanstack/react-query';

import { tripAPI } from '@/api';
import { Result } from '@/types/apis/common';
import { Trip } from '@/types/trip';

// 여행 티켓 목록 조회
export const useTripTicketList = () => {
    return useQuery<Result<Trip[]>, Error, Trip[]>({
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

// 특정 여행 정보 조회
export const useTripTicketInfo = (tripId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['ticket-info', tripId],
        queryFn: () => tripAPI.fetchTripTicketInfo(tripId),
        enabled,
    });
};

export const useTripTimeline = (tripId: string) => {
    return useQuery({
        queryKey: ['trip-timeline', tripId],
        queryFn: () => tripAPI.fetchTripTimeline(tripId),
    });
};
