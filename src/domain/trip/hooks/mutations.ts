import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Trip } from '@/domain/trip/types';
import { mediaAPI, tripAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/utils';

export const useTripDelete = () => {
    return useMutation({
        mutationFn: (tripKey: string) => toResult(() => tripAPI.deleteTripTicket(tripKey)),
    });
};

export const useTripUpdate = () => {
    return useMutation({
        mutationFn: ({ tripKey, form }: { tripKey: string; form: Trip }) =>
            toResult(() => tripAPI.updateTripTicketInfo(tripKey, form)),
    });
};

export const useMediaDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tripKey, images }: { tripKey: string; images: string[] }) =>
            mediaAPI.deleteImages(tripKey, images),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trip-images'] });
        },
    });
};
