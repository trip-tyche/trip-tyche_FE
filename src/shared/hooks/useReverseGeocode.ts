import { useEffect, useState } from 'react';

import { getAddressFromLocation } from '@/libs/utils/map';
import { useMapScript } from '@/shared/hooks/useMapScript';

export const useReverseGeocode = (latitude: number, longitude: number) => {
    const [address, setAddress] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const { isMapScriptLoaded } = useMapScript();

    useEffect(() => {
        if (!isMapScriptLoaded) return;

        const convertAddress = async () => {
            setIsLoading(true);
            try {
                // const result =
                //     latitude && longitude ? await getAddressFromLocation({ latitude, longitude }) : '위치 정보 없음';
                const result = '위치 정보 없음';
                setAddress(result);
            } finally {
                setIsLoading(false);
            }
        };

        convertAddress();
    }, [latitude, longitude, isMapScriptLoaded]);

    return { address, isLoading };
};
