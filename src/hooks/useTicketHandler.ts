import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/paths';
import { useTripDelete } from '@/hooks/mutations/useTrip';
import { useToastStore } from '@/stores/useToastStore';
import useUserDataStore from '@/stores/useUserDataStore';

export const useTicketHandler = (tripId: string) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const setIsTripInfoEditing = useUserDataStore((state) => state.setIsTripInfoEditing);
    const deleteTripTicket = useUserDataStore((state) => state.deleteTripTicket);
    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();
    const { mutate } = useTripDelete();

    const handleImageUpload = () => {
        setIsTripInfoEditing(true);
        navigate(`${ROUTES.PATH.TRIPS.IMAGES(Number(tripId))}`);
    };

    const handleTripEdit = () => {
        setIsTripInfoEditing(true);
        navigate(`${ROUTES.PATH.TRIPS.EDIT(Number(tripId))}`);
    };

    const handleTripDelete = () => {
        setIsModalOpen(true);
    };

    const deleteTrip = async () => {
        try {
            mutate(tripId, {
                onSuccess: () => {
                    deleteTripTicket();
                    showToast('여행이 삭제되었습니다.');
                },
            });
        } catch (error) {
            showToast('여행 삭제에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsModalOpen(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return {
        isModalOpen,
        handleImageUpload,
        handleTripEdit,
        handleTripDelete,
        deleteTrip,
        closeModal,
    };
};
