import { useMemo } from 'react';

import { useLoadScript } from '@react-google-maps/api';

import { GOOGLE_MAPS_CONFIG, MARKER_ICON_CONFIG } from '@/constants/googleMaps';

export const useGoogleMaps = () => {
    const { isLoaded, loadError } = useLoadScript(GOOGLE_MAPS_CONFIG);

    const markerIcon = useMemo(() => {
        if (!isLoaded || !window.google) {
            return;
        }
        return {
            ...MARKER_ICON_CONFIG,
            anchor: new window.google.maps.Point(12, 23),
        };
    }, [isLoaded]);

    return { isLoaded, loadError, markerIcon };
};
