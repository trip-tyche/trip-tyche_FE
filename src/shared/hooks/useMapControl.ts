import { useCallback, useEffect, useRef, useState } from 'react';

import { useMapScript } from '@/shared/hooks/useMapScript';
import { Location, MapType } from '@/shared/types/map';

export const useMapControl = (initialZoom: number, initialCenter: Location | null) => {
    const { isMapScriptLoaded, isMapScriptLoadError } = useMapScript();

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
