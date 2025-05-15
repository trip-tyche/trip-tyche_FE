import { useQuery } from '@tanstack/react-query';

import { routeAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';

export const useRoute = (tripKey: string) => {
    return useQuery({
        queryKey: ['trip', 'route', tripKey],
        queryFn: () => toResult(() => routeAPI.fetchTripRoute(tripKey)),
        select: (result) => {
            return result.success
                ? {
                      ...result,
                      data: result.data,
                  }
                : result;
        },
    });
};
