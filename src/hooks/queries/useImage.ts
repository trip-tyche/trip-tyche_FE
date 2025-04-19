import { useQuery } from '@tanstack/react-query';

import { MediaFileMetaData } from '@/domain/media/types';
import { mediaAPI } from '@/libs/apis';
import { Result } from '@/libs/apis/types';
import { toResult } from '@/libs/apis/utils';

interface MediaFile {
    startDate: string;
    endDate: string;
    mediaFiles: MediaFileMetaData[];
}

export const useTripImages = (tripKey: string) => {
    return useQuery<Result<MediaFile>, Error, MediaFileMetaData[] | undefined>({
        queryKey: ['trip-images', tripKey],
        // queryFn: () => mediaAPI.getTripImages(tripKey),
        queryFn: () => toResult(() => mediaAPI.getTripImages(tripKey)),
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
