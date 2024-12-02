import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/paths';

export const useTicketNavigation = (tripId: string, isModalOpen: boolean) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                navigate(`${ROUTES.PATH.TRIPS.TIMELINE.MAP(Number(tripId))}`);
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [isAnimating, tripId, navigate]);

    const handleCardClick = () => {
        if (!isModalOpen) {
            setIsAnimating(true);
        }
    };

    return {
        isAnimating,
        handleCardClick,
    };
};
