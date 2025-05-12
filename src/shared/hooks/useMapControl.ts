import { useCallback, useRef, useState } from 'react';

import { useLoadScript } from '@react-google-maps/api';

import { GOOGLE_MAPS_CONFIG } from '@/shared/constants/map';
import { Location, MapType } from '@/shared/types/map';

export const useMapControl = () => {
    const [isMapRendered, setIsMapRendered] = useState(false);
    const { isLoaded: isMapScriptLoaded, loadError: isMapScriptLoadError } = useLoadScript(GOOGLE_MAPS_CONFIG);

    const mapRef = useRef<MapType | null>(null);

    const handleMapRender = useCallback((map: MapType) => {
        if (map) {
            mapRef.current = map;
            setIsMapRendered(true);
        }
    }, []);

    const updateMapStatus = (
        zoom: number | null,
        center: Location | null,
        handler?: { onZoomChange?: () => void; onCenterChange?: () => void },
    ) => {
        if (mapRef.current) {
            const { onZoomChange, onCenterChange } = handler || {};

            if (zoom) {
                mapRef.current.setZoom(zoom);
                onZoomChange?.();
            }

            if (center) {
                mapRef.current.setCenter({ lat: center.latitude, lng: center.longitude });
                onCenterChange?.();
            }
        }
    };

    return {
        isMapScriptLoaded,
        isMapScriptLoadError,
        mapRef,
        isMapRendered,
        updateMapStatus,
        handleMapRender,
    };
};
