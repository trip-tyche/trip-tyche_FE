import { useQuery } from '@tanstack/react-query';

import { tripImageAPI } from '@/api';
import { Result } from '@/api/types';
import { toResult } from '@/api/utils';
import { MediaFileMetaData } from '@/types/media';

interface MediaFile {
    startDate: string;
    endDate: string;
    mediaFiles: MediaFileMetaData[];
}

export const useTripImages = (tripKey: string) => {
    return useQuery<Result<MediaFile>, Error, MediaFileMetaData[] | undefined>({
        queryKey: ['trip-images', tripKey],
        // queryFn: () => tripImageAPI.getTripImages(tripKey),
        queryFn: () => toResult(() => tripImageAPI.getTripImages(tripKey)),
        enabled: !!tripKey,
        select: (result) => {
            if (!result.success) {
                // throw new Error(result.error);
                console.error(result.error);
            } else {
                return result.data.mediaFiles;
            }
        },
    });
};
