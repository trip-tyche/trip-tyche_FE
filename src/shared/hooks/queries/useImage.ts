import { useQuery } from '@tanstack/react-query';

import { mediaAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';

export const useTripImages = (tripKey: string) => {
    return useQuery({
        queryKey: ['trip-images', tripKey],
        queryFn: () => toResult(() => mediaAPI.getTripImages(tripKey)),
        select: (result) => {
            return result.success
                ? {
                      ...result,
                      data: result.data.mediaFiles,
                  }
                : result;
        },
    });
};
