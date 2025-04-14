import { Libraries } from '@react-google-maps/api';

import { MapOption } from '@/types/maps';

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const GOOGLE_MAPS_CONFIG = {
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'] as Libraries,
    language: 'ko',
    region: 'KR',
} as const;

export const GOOGLE_MAPS_OPTIONS: MapOption = {
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

export const DEFAULT_ZOOM_SCALE = {
    LOCATION_ADD: 12,
    IMAGE_BY_DATE: 13,
    TIMELINE: 14,
    INDIVIDUAL_MARKER_VISIBLE: 17,
};

export const MARKER_CLUSTER_OPTIONS = {
    maxZoom: DEFAULT_ZOOM_SCALE.INDIVIDUAL_MARKER_VISIBLE - 1,
    zoomOnClick: true,
    minimumClusterSize: 1,
    clickZoom: 2,
} as const;

export const TIMELINE_MAP = {
    PHOTO_CARD: {
        WIDTH: 100,
        HEIGHT: 100,
    },
    DURATION: {
        MOVE: 3000,
        WAIT: 3000,
    },
} as const;
