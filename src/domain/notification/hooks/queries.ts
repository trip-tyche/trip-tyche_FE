import { useQuery } from '@tanstack/react-query';

import { notifiactionAPI } from '@/api';
import { toResult } from '@/api/utils';

export const useNotificationList = (userId: number) => {
    return useQuery({
        queryKey: ['notification', userId],
        queryFn: () => toResult(() => notifiactionAPI.fetchNotificationList(userId)),
    });
};
