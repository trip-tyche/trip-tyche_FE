import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { tripAPI } from '@/api';
import { PATH } from '@/constants/path';
import { useToastStore } from '@/stores/useToastStore';
import useUserDataStore from '@/stores/useUserDataStore';

export const useTicketHandler = (tripId: string) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const setIsTripInfoEditing = useUserDataStore((state) => state.setIsTripInfoEditing);
    const deleteTripTicket = useUserDataStore((state) => state.deleteTripTicket);
    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();

    const handleImageUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsTripInfoEditing(true);
        navigate(`${PATH.TRIPS.NEW.IMAGES(Number(tripId))}`);
    };

    const handleTripEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsTripInfoEditing(true);
        navigate(`${PATH.TRIPS.EDIT(Number(tripId))}`);
    };

    const handleTripDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsModalOpen(true);
    };

    const deleteTrip = async () => {
        try {
            await tripAPI.deleteTripTicket(tripId);
            deleteTripTicket();
            showToast('여행이 삭제되었습니다.');
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
