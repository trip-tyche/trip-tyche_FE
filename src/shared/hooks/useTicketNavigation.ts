import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/route';

export const useTicketNavigation = (tripKey: string) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                navigate(`${ROUTES.PATH.TRIP.ROOT(tripKey)}`);
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [isAnimating, tripKey, navigate]);

    const handleCardClick = () => {
        setIsAnimating(true);
    };

    return {
        isAnimating,
        handleCardClick,
    };
};
