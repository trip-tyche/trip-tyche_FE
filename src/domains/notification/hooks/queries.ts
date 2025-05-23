import { useQuery } from '@tanstack/react-query';

import { notifiactionAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';

export const useNotificationList = (userId: number) => {
    return useQuery({
        queryKey: ['notification', userId],
        queryFn: () => toResult(() => notifiactionAPI.fetchNotificationList(userId)),
    });
};

export const useNotificationDetail = (notificationId: number) => {
    return useQuery({
        queryKey: ['notificationId-detail', notificationId],
        queryFn: () => toResult(() => notifiactionAPI.fetchNotificationDetail(notificationId)),
    });
};
