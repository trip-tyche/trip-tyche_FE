import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Trip } from '@/domains/trip/types';
import { mediaAPI, tripAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';

export const useTripDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tripKey: string) => toResult(() => tripAPI.deleteTripTicket(tripKey)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
        },
    });
};

export const useTripFormSubmit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ tripKey, tripForm }: { tripKey: string; tripForm: Trip }) =>
            toResult(() => tripAPI.updateTripForm(tripKey, tripForm), {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
                },
            }),
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
