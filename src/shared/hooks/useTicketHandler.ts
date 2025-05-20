import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useShareUnlink } from '@/domains/share/hooks/mutations';
import { useTripDelete } from '@/domains/trip/hooks/mutations';
import { ROUTES } from '@/shared/constants/route';

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

    const { mutateAsync: deleteTripAsync, isPending: isDeleting } = useTripDelete();
    const { mutateAsync: unlinkSharedAsync, isPending: isUnLinking } = useShareUnlink();

    const handler = {
        edit: (isCompletedTrip: boolean) => {
            navigate(`${ROUTES.PATH.TRIP.EDIT.INFO(tripKey!)}`, { state: { isDraft: !isCompletedTrip } });
        },
        images: () => navigate(`${ROUTES.PATH.TRIP.EDIT.IMAGE(tripKey!)}`),
        delete: () => {
            setIsModalOpen(true);
        },
        shwoShareInfo: () => {},
        unlinkShared: () => {},
    };

    const deleteTrip = async () => {
        setIsModalOpen(false);
        const result = await deleteTripAsync(tripKey);
        if (!result.success) {
            onError?.(result.error);
            setIsModalOpen(false);
            return;
        }
        onSuccess?.(result.data);
    };

    const unlinkShared = async (shareId: number) => {
        setIsModalOpen(false);
        const result = await unlinkSharedAsync(shareId);
        if (!result.success) {
            onError?.(result.error);
            setIsModalOpen(false);
            return;
        }
        onSuccess?.(result.data);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return {
        isModalOpen,
        isDeleting,
        isUnLinking,
        handler,
        deleteTrip,
        unlinkShared,
        closeModal,
    };
};
