import { useQuery } from '@tanstack/react-query';

import { shareAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/utils';

export const useShareDetail = (shareId: number) => {
    return useQuery({
        queryKey: ['share', shareId],
        queryFn: () => toResult(() => shareAPI.fetchShareDetail(shareId)),
    });
};
