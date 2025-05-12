import { useRef, useState } from 'react';

import { useLoadScript } from '@react-google-maps/api';

import { GOOGLE_MAPS_CONFIG } from '@/shared/constants/map';
import { MapType } from '@/shared/types/map';

export const useMap = () => {
    const { isLoaded: isMapScriptLoaded, loadError: isMapScriptLoadError } = useLoadScript(GOOGLE_MAPS_CONFIG);
    const [isMapRendered, setIsMapRendered] = useState(false);

    const mapRef = useRef<MapType | null>(null);

    // console.log('hook-map', mapRef.current?.getZoom());
    const updateMapStatus = () => {};

    const handleMapRender = (map: MapType) => {
        if (!map) return;

        mapRef.current = map;
        setIsMapRendered(true);
    };

    return {
        isMapScriptLoaded,
        isMapScriptLoadError,
        mapRef,
        isMapRendered,
        handleMapRender,
    };
};
