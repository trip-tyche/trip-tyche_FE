import { useQuery } from '@tanstack/react-query';

import { MediaFile } from '@/domains/media/types';
import { mediaAPI } from '@/libs/apis';
import { Result } from '@/libs/apis/types';
import { toResult } from '@/libs/apis/utils';

interface MediaFiles {
    startDate: string;
    endDate: string;
    mediaFiles: MediaFile[];
}

export const useTripImages = (tripKey: string) => {
    return useQuery<Result<MediaFiles>, Error, MediaFile[] | undefined>({
        queryKey: ['trip-images', tripKey],
        queryFn: () => toResult(() => mediaAPI.getTripImages(tripKey)),
        select: (result) => {
            if (!result.success) {
                console.error(result.error);
            } else {
                return result.data.mediaFiles;
            }
        },
        enabled: !!tripKey,
    });
};
