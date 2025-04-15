import { useQuery } from '@tanstack/react-query';

import { notifiactionAPI } from '@/api';
import { toResult } from '@/api/utils';

export const useNotificationList = (userId: number) => {
    return useQuery({
        queryKey: ['notifiaction', userId],
        queryFn: () => toResult(() => notifiactionAPI.fetchNotificationList(userId)),
    });
};

// export const useShareStatus = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: ({ shareId, status }: { shareId: number; status: string }) =>
//             toResult(() => notifiactionAPI.updateShareStatus(shareId, status)),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['share'] });
//         },
//     });
// };
