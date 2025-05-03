import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { mediaAPI } from '@/libs/apis';
import { DEFAULT_CENTER } from '@/shared/constants/maps/config';

export const useTripDefaultLocation = (tripKey: string) => {
    return useQuery({
        queryKey: ['trip-default-location', tripKey],
        queryFn: async () => {
            try {
                const response = await mediaAPI.fetchDefaultLocation(tripKey);
                return response;
            } catch (error) {
                if (error instanceof AxiosError && error?.response?.data.status) {
                    return DEFAULT_CENTER;
                }
            }
        },
    });
};
