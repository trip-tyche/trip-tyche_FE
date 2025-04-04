import { useQuery } from '@tanstack/react-query';

import { tripImageAPI } from '@/api';
import { Result } from '@/types/apis/common';
import { MediaFileMetaData } from '@/types/media';

export const useTripImages = (tripId: string) => {
    return useQuery<Result<MediaFileMetaData[]>, Error, MediaFileMetaData[]>({
        queryKey: ['trip-images', tripId],
        queryFn: () => tripImageAPI.getTripImages(tripId),
        enabled: !!tripId,
        select: (result) => {
            if (!result.isSuccess || !result.data) {
                throw new Error(result.error);
            }
            return result.data;
        },
    });
};
