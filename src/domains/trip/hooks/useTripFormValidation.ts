import { useEffect, useState } from 'react';

import { TripInfo } from '@/domains/trip/types';
import { validateFormComplete } from '@/libs/utils/validate';

export const useTripFormValidation = (tripInfo: TripInfo) => {
    const [isFormComplete, setIsFormComplete] = useState(false);

    useEffect(() => {
        const { tripTitle, country, startDate, endDate, hashtags } = tripInfo;
        const exceptMediaFileImages = {
            tripTitle,
            country,
            startDate,
            endDate,
            hashtags,
        };

        console.log('exceptMediaFileImages', exceptMediaFileImages);

        if (validateFormComplete(exceptMediaFileImages)) {
            setIsFormComplete(true);
            return;
        }
        setIsFormComplete(false);
    }, [tripInfo]);

    return { isFormComplete };
};
