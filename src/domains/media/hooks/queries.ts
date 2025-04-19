import { useQuery } from '@tanstack/react-query';

import { mediaAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/utils';

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

export const useMediaByDate = (tripKey: string, date: string) =>
    useQuery({
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
        enabled: !!date,
    });
