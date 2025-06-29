import { useEffect, useState } from 'react';

import { TripInfo } from '@/domains/trip/types';
import { validateFormComplete } from '@/libs/utils/validate';

export const useTripFormValidation = (tripInfo: TripInfo) => {
    const [isFormComplete, setIsFormComplete] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    useEffect(() => {
        const { mediaFilesDates, ...exceptMediaFileImages } = tripInfo;
        if (validateFormComplete(exceptMediaFileImages)) {
            setIsFormComplete(true);
            return;
        }
        setIsFormComplete(false);
    }, [tripInfo]);

    return { isFormComplete };
};
