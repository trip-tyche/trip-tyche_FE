import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useTripDelete } from '@/domains/trip/hooks/mutations';
import { ROUTES } from '@/shared/constants/paths';

export const useTicketHandler = (
    tripKey: string,
    callback?: {
        onSuccess?: (message: string) => void;
        onError?: (message: string) => void;
    },
) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { onSuccess, onError } = callback || {};

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useTripDelete();

    const handler = {
        edit: () => navigate(`${ROUTES.PATH.TRIP.MANAGEMENT.EDIT(tripKey!)}`),
        images: () => navigate(`${ROUTES.PATH.TRIP.MANAGEMENT.IMAGES(tripKey!)}`),
        delete: () => {
            setIsModalOpen(true);
        },
    };

    const deleteTrip = async () => {
        setIsModalOpen(false);
        const result = await mutateAsync(tripKey);
        if (!result.success) {
            onError?.(result.error);
            setIsModalOpen(false);
            return;
        }
        onSuccess?.(result.data);
        queryClient.invalidateQueries({ queryKey: ['ticket-list'] });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return {
        isModalOpen,
        isPending,
        handler,
        deleteTrip,
        closeModal,
    };
};
