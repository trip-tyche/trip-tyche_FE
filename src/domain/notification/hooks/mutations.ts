import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notifiactionAPI } from '@/api';
import { toResult } from '@/api/utils';

export const useNotificationStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notificationId: number) =>
            toResult(() => notifiactionAPI.updateNotificationStatus(notificationId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notification'] });
        },
    });
};
