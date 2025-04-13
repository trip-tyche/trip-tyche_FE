import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

// import { tripImageAPI } from '@/api';
import { ROUTES } from '@/constants/paths';

export const useTicketNavigation = (tripKey: string) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isUnlocatedImageModalOpen, setIsUnlocatedImageModalOpen] = useState(false);
    // const [unlocatedImagesCount, setUnlocatedImagesCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                navigate(`${ROUTES.PATH.TRIPS.TIMELINE.MAP(tripKey)}`);
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [isAnimating, tripKey, navigate]);

    const handleCardClick = async () => {
        // const unlocatedImagesDate = await tripImageAPI.fetchUnlocatedImages(tripKey);
        // if (!unlocatedImagesDate) {
        setIsAnimating(true);
        // return;
        // }

        // const unlocatedImages = unlocatedImagesDate.map((image) => image.media);

        // setUnlocatedImagesCount(unlocatedImages.length);
        // setIsUnlocatedImageModalOpen(true);
    };

    const confirmUnlocatedImageModal = () => {
        setIsUnlocatedImageModalOpen(false);
        setTimeout(() => {
            navigate(`${ROUTES.PATH.TRIPS.NEW.LOCATIONS(tripKey)}`);
        }, 0);
    };

    const closeUnlocatedImageModal = () => {
        setIsUnlocatedImageModalOpen(false);
        setIsAnimating(true);
    };

    return {
        isAnimating,
        isUnlocatedImageModalOpen,
        // unlocatedImagesCount,
        confirmUnlocatedImageModal,
        closeUnlocatedImageModal,
        handleCardClick,
    };
};
