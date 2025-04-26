import { useQuery } from '@tanstack/react-query';

import { shareAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/utils';

export const useShareDetail = (shareId: number, isDetailOpen: boolean = false) => {
    return useQuery({
        queryKey: ['share', shareId],
        queryFn: () => toResult(() => shareAPI.fetchShareDetail(shareId)),
        enabled: isDetailOpen,
    });
};
