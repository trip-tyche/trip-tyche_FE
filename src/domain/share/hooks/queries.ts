import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { shareAPI } from '@/api';
import { toResult } from '@/api/utils';

export const useShareDetail = (shareId: number) => {
    return useQuery({
        queryKey: ['share', shareId],
        queryFn: () => toResult(() => shareAPI.fetchShareDetail(shareId)),
    });
};

export const useShareStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ shareId, status }: { shareId: number; status: string }) =>
            toResult(() => shareAPI.updateShareStatus(shareId, status)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['share'] });
        },
    });
};
