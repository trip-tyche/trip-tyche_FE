import { useQuery } from '@tanstack/react-query';

import { notificationAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';

export const useNotificationList = (userId: number) => {
    return useQuery({
        queryKey: ['notification', userId],
        queryFn: () => toResult(() => notificationAPI.fetchNotificationList(userId)),
        staleTime: 0,
    });
};

export const useNotificationDetail = (notificationId: number) => {
    return useQuery({
        queryKey: ['notificationId-detail', notificationId],
        queryFn: () => toResult(() => notificationAPI.fetchNotificationDetail(notificationId)),
    });
};
