import { useQuery } from '@tanstack/react-query';

import { userAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';

export const useSummary = () =>
    useQuery({
        queryKey: ['summary'],
        queryFn: () => toResult(() => userAPI.fetchUserInfo()),
        staleTime: 0,
        select: (result) => {
            return result.success
                ? {
                      ...result,
                      data: result.data,
                  }
                : result;
        },
    });
