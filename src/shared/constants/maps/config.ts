import { Libraries } from '@react-google-maps/api';

import { MapOption } from '@/shared/types/map';

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const GOOGLE_MAPS_CONFIG = {
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'] as Libraries,
    language: 'ko',
    region: 'KR',
} as const;

export const MAPS_OPTIONS: MapOption = {
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: false,
    streetViewControl: false,
    rotateControl: true,
    clickableIcons: false,
} as const;

export const DEFAULT_CENTER = {
    latitude: 37.5,
    longitude: 127,
} as const;

export const ZOOM_SCALE = {
    DEFAULT: {
        LOCATION_ADD: 12,
        IMAGE_BY_DATE: 13,
        ROUTE: 14,
    },
    INDIVIDUAL_IMAGE_MARKERS_VISIBLE: 15,
};

export const MARKER_CLUSTER_OPTIONS = {
    maxZoom: ZOOM_SCALE.INDIVIDUAL_IMAGE_MARKERS_VISIBLE - 1,
    zoomOnClick: true,
    minimumClusterSize: 1,
    clickZoom: 2,
} as const;
