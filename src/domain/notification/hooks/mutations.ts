import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notifiactionAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/utils';

export const useNotificationStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notificationId: number) =>
            toResult(() => notifiactionAPI.updateNotificationStatus(notificationId)),
        // onMutate: () => {
        //     queryClient.setQueryData(['notification'], (older) => {
        //         console.log(older);
        //     });
        // },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notification'] });
        },
    });
};

export const useNotificationDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notificationIds: number[]) => toResult(() => notifiactionAPI.deleteNotification(notificationIds)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notification'] });
        },
    });
};
