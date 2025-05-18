import { useCallback, useEffect, useRef, useState } from 'react';

import { useLoadScript } from '@react-google-maps/api';

import { GOOGLE_MAPS_CONFIG } from '@/shared/constants/map';
import { Location, MapType } from '@/shared/types/map';

export const useMapControl = (initialZoom: number | null, initialCenter: Location | null) => {
    const { isLoaded: isMapScriptLoaded, loadError: isMapScriptLoadError } = useLoadScript(GOOGLE_MAPS_CONFIG);

    const [isMapRendered, setIsMapRendered] = useState(false);
    const [zoom, setZoom] = useState(initialZoom);
    const [center, setCenter] = useState(initialCenter);

    const mapRef = useRef<MapType | null>(null);

    useEffect(() => {
        setCenter(initialCenter);
    }, [initialCenter]);

    const handleMapRender = useCallback((map: MapType) => {
        if (map) {
            mapRef.current = map;
            setIsMapRendered(true);
        }
    }, []);

    const handleMapZoomChanged = useCallback((callback?: () => void) => {
        if (mapRef.current) {
            const newZoom = mapRef.current.getZoom();
            if (newZoom) {
                setZoom(newZoom);
                callback?.();
            }
        }
    }, []);

    const updateMapZoom = useCallback((zoom: number, callback?: () => void) => {
        if (mapRef.current) {
            mapRef.current.setZoom(zoom);
            setZoom(zoom);
            callback?.();
        }
    }, []);

    const updateMapCenter = useCallback((center: Location) => {
        if (mapRef.current) {
            mapRef.current.panTo({ lat: center.latitude, lng: center.longitude });
            setCenter(center);
        }
    }, []);

    return {
        mapRef,
        mapStatus: {
            zoom,
            center,
        },
        isMapScriptLoaded,
        isMapScriptLoadError,
        isMapRendered,
        handleMapRender,
        handleMapZoomChanged,
        updateMapZoom,
        updateMapCenter,
    };
};
