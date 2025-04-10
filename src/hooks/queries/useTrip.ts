import { useQuery } from '@tanstack/react-query';

import { tripAPI } from '@/api';
import { toResult } from '@/api/utils';

// 여행 티켓 목록 조회
export const useTripTicketList = () => {
    return useQuery({
        retry: 3,
        queryKey: ['ticket-list'],
        queryFn: () => toResult(() => tripAPI.fetchTripTicketList()),
        select: (result) =>
            result.success
                ? {
                      ...result,
                      data: result.data.trips,
                  }
                : result,
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

// export const useTripTimeline = (tripId: string) => {
//     return useQuery({
//         queryKey: ['trip-timeline', tripId],
//         queryFn: () => tripAPI.fetchTripTimeline(tripId),
//     });
// };
