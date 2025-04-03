import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tripAPI } from '@/api';

export const useTripDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tripId: string) => tripAPI.deleteTripTicket(tripId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
        },
    });
};
