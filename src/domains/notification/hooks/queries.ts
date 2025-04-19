import { useQuery } from '@tanstack/react-query';

import { notifiactionAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/utils';

export const useNotificationList = (userId: number) => {
    return useQuery({
        queryKey: ['notification', userId],
        queryFn: () => toResult(() => notifiactionAPI.fetchNotificationList(userId)),
    });
};
