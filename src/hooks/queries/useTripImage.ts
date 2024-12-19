import { useQuery } from '@tanstack/react-query';

import { tripImageAPI } from '@/api';

export const useTripDefaultLocation = (tripId: string) => {
    return useQuery({
        queryKey: ['trip-default-location', tripId],
        queryFn: () => tripImageAPI.fetchDefaultLocation(tripId),
        staleTime: 10 * 60 * 1000,
    });
};
