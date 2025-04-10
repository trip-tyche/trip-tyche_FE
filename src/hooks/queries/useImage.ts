import { useQuery } from '@tanstack/react-query';

import { tripImageAPI } from '@/api';
import { toResult } from '@/api/utils';
import { Result } from '@/types/apis/common';
import { MediaFileMetaData } from '@/types/media';

interface MediaFile {
    startDate: string;
    endDate: string;
    mediaFiles: MediaFileMetaData[];
}

export const useTripImages = (tripId: string) => {
    return useQuery<Result<MediaFile>, Error, MediaFileMetaData[] | undefined>({
        queryKey: ['trip-images', tripId],
        // queryFn: () => tripImageAPI.getTripImages(tripId),
        queryFn: () => toResult(() => tripImageAPI.getTripImages(tripId)),
        enabled: !!tripId,
        select: (result) => {
            if (!result.success) {
                // throw new Error(result.error);
                console.log(result.error);
            } else {
                return result.data.mediaFiles;
            }
        },
    });
};
