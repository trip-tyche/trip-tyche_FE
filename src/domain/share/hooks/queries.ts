import { useQuery } from '@tanstack/react-query';

import { shareAPI } from '@/api';
import { toResult } from '@/api/utils';

export const useShareDetail = (shareId: number) => {
    return useQuery({
        queryKey: ['share', shareId],
        queryFn: () => toResult(() => shareAPI.fetchShareDetail(shareId)),
    });
};
