import { Libraries } from '@react-google-maps/api';

import characterImage from '/character-1.png';

import { ENV } from '@/constants/api';
import theme from '@/styles/theme';
import { MapOption, PolylineOption } from '@/types/map';

export const GOOGLE_MAPS_CONFIG = {
    googleMapsApiKey: ENV.GOOGLE_MAPS_API_KEY || '',
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

export const POLYLINE_OPTIONS: PolylineOption = {
    strokeColor: `${theme.colors.descriptionText}`,
    strokeOpacity: 0,
    strokeWeight: 2,
    icons: [
        {
            icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 0.5,
                scale: 3,
            },
            offset: '0',
            repeat: '15px',
        },
    ],
} as const;

export const MARKER_ICON_CONFIG = {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: '#0073bb',
    fillOpacity: 1,
    strokeWeight: 1,
    rotation: 0,
    scale: 1.5,
} as const;

export const CHARACTER_ICON_CONFIG = {
    url: characterImage,
    scaledSize: { width: 50, height: 65 },
    anchorPoint: { x: 25, y: 65 },
} as const;

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
