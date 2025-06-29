import { useEffect, useState } from 'react';

import { getAddressFromLocation } from '@/libs/utils/map';
import { useMapScript } from '@/shared/hooks/useMapScript';
import { Location } from '@/shared/types/map';

export const useAddressAggregation = (locations: Location[]) => {
    const [addresses, setAddresses] = useState<{ place: string; count: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isMapScriptLoaded } = useMapScript();

    useEffect(() => {
        if (!locations.length || !isMapScriptLoaded) return;

        const aggregateAddresses = async () => {
            setIsLoading(true);
            try {
                const addresses = await Promise.all(
                    locations.map(async (location) => {
                        const { latitude, longitude } = location;
                        return latitude && longitude ? await getAddressFromLocation({ latitude, longitude }) : '';
                    }),
                );

                const addressesMap = new Map();

                addresses.forEach((address) => {
                    if (address) {
                        if (addressesMap.has(address)) {
                            addressesMap.set(address, addressesMap.get(address) + 1);
                        } else {
                            addressesMap.set(address, 1);
                        }
                    }
                });

                const aggregatedAddresses = Array.from(addresses).map((address) => ({
                    place: `${address[0]}`,
                    count: Number(address[1]),
                }));
                setAddresses(aggregatedAddresses);
            } finally {
                setIsLoading(false);
            }
        };

        aggregateAddresses();
    }, [locations, isMapScriptLoaded]);

    return { addresses, isLoading };
};
