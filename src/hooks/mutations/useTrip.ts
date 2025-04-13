import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tripAPI, tripImageAPI } from '@/api';

export const useTripDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tripKey: string) => tripAPI.deleteTripTicket(tripKey),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
        },
    });
};

export const useImagesDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tripKey, images }: { tripKey: string; images: string[] }) =>
            tripImageAPI.deleteImages(tripKey, images),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trip-images'] });
        },
    });
};
