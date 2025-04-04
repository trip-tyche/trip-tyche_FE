import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tripAPI, tripImageAPI } from '@/api';

export const useTripDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tripId: string) => tripAPI.deleteTripTicket(tripId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
        },
    });
};

export const useImagesDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tripId, images }: { tripId: string; images: string[] }) =>
            tripImageAPI.deleteImages(tripId, images),

        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
            console.log('deleteeeeeeeeee');
        },
    });
};
