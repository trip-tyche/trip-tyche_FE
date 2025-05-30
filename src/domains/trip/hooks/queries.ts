import { useQuery } from '@tanstack/react-query';

import { tripAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';

// 여행 티켓 목록 조회
export const useTripTicketList = (isEnable: boolean) => {
    return useQuery({
        queryKey: ['ticket-list'],
        queryFn: () => toResult(() => tripAPI.fetchTripTicketList()),
        select: (result) => {
            return result.success
                ? {
                      ...result,
                      data: result.data.trips,
                  }
                : result;
        },
        enabled: isEnable,
    });
};

// 특정 여행 정보 조회
export const useTripInfo = (tripKey: string) => {
    return useQuery({
        queryKey: ['ticket-info', tripKey],
        queryFn: () => toResult(() => tripAPI.fetchTripTicketInfo(tripKey)),
    });
};
