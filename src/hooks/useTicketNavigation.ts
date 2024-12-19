import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import { ROUTES } from '@/constants/paths';

export const useTicketNavigation = (tripId: string) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isUnlocatedImageModalOpen, setIsUnlocatedImageModalOpen] = useState(false);
    const [unlocatedImagesCount, setUnlocatedImagesCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                navigate(`${ROUTES.PATH.TRIPS.TIMELINE.MAP(Number(tripId))}`);
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [isAnimating, tripId, navigate]);

    const handleCardClick = async () => {
        const unlocatedImages = await tripImageAPI.fetchUnlocatedImages(tripId);

        if (!unlocatedImages) {
            setIsAnimating(true);
            return;
        }

        setUnlocatedImagesCount(unlocatedImages.length);
        setIsUnlocatedImageModalOpen(true);
    };

    const confirmUnlocatedImageModal = () => {
        setIsUnlocatedImageModalOpen(false);
        setTimeout(() => {
            navigate(`${ROUTES.PATH.TRIPS.NEW.LOCATIONS(Number(tripId))}`);
        }, 0);
    };

    const closeUnlocatedImageModal = () => {
        setIsUnlocatedImageModalOpen(false);
        setIsAnimating(true);
    };

    return {
        isAnimating,
        isUnlocatedImageModalOpen,
        unlocatedImagesCount,
        confirmUnlocatedImageModal,
        closeUnlocatedImageModal,
        handleCardClick,
    };
};
