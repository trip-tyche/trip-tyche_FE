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

export const useMediaByPinPoint = (tripKey: string, pinPointId: string) =>
    useQuery({
        queryKey: ['media', 'by-pinPoint', tripKey, pinPointId],
        queryFn: () => toResult(() => mediaAPI.fetchMediaByPinPoint(tripKey, pinPointId)),
        select: (result) => {
            return result.success
                ? {
                      ...result,
                      data: result.data.mediaFiles,
                  }
                : result;
        },
    });

export const useMediaByDate = (tripKey: string, date: string) => {
    if (!tripKey || !date) {
        console.error('tripKey와 date은 필수값입니다.');
    }

    return useQuery({
        queryKey: ['media', 'by-date', tripKey, date],
        queryFn: () => toResult(() => mediaAPI.fetchMediaByDate(tripKey, date)),
        select: (result) => {
            return result.success
                ? {
                      ...result,
                      data: result.data.mediaFiles,
                  }
                : result;
        },
        enabled: Boolean(tripKey && date),
    });
};
