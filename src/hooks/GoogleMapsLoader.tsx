import { useMemo } from 'react';

import { useLoadScript } from '@react-google-maps/api';

import { GOOGLE_MAPS_CONFIG } from '@/constants/maps/config';
import { MARKER_ICON_CONFIG } from '@/constants/maps/styles';

export const useGoogleMaps = () => {
    const { isLoaded, loadError } = useLoadScript(GOOGLE_MAPS_CONFIG);

    const markerIcon = useMemo(() => {
        if (!isLoaded) {
            return;
        }
        return {
            ...MARKER_ICON_CONFIG,
            anchor: new window.google.maps.Point(12, 23),
        };
    }, [isLoaded]);

    return { isLoaded, loadError, markerIcon };
};
