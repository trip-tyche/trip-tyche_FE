import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { useTripUpdate } from '@/domains/trip/hooks/mutations';
import { TripInfo } from '@/domains/trip/types';
import { tripAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';
import { validateFormComplete } from '@/libs/utils/validate';

export const useTripInfoSubmit = (tripInfo: TripInfo) => {
    const [isFormComplete, setIsFormComplete] = useState(false);
    const { mutateAsync, isPending: isSubmitting } = useTripUpdate();

    const { tripKey } = useParams();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (validateFormComplete(tripInfo)) {
            setIsFormComplete(true);
            return;
        }
        setIsFormComplete(false);
    }, [tripInfo]);

    const submitTripInfo = async (tripInfo: TripInfo) => {
        if (!tripKey) {
            return { success: false, error: 'Trip key가 없습니다' };
        }

        return await mutateAsync(
            { tripKey, tripInfo },
            {
                onSuccess: (result) => {
                    if (result.success) {
                        queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
                    }
                },
            },
        );
    };

    const finalizeTrip = async () => {
        if (!tripKey) {
            return { success: false, error: 'Trip key가 없습니다' };
        }

        return await toResult(() => tripAPI.finalizeTripTicket(tripKey));
    };

    return { isSubmitting, isFormComplete, submitTripInfo, finalizeTrip };
};
