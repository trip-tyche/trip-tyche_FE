import { Libraries } from '@react-google-maps/api';

import { COLORS } from '@/shared/constants/theme';
import { MapOption, PolylineOption } from '@/shared/types/map';

import characterImage from '/character-1.png';

// Goole Maps API Key
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Goole Maps 로드를 위한 환경 설정
export const GOOGLE_MAPS_CONFIG = {
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'] as Libraries,
    language: 'ko',
    region: 'KR',
} as const;

// 기본 지도 옵션
export const MAPS_OPTIONS: MapOption = {
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: false,
    streetViewControl: false,
    rotateControl: true,
    clickableIcons: false,
} as const;

// 지도 기본 중심 좌표(center)
export const DEFAULT_CENTER = {
    latitude: 37.5,
    longitude: 127,
} as const;

// 지도 줌레벨(zoom)
export const ZOOM_SCALE = {
    DEFAULT: {
        LOCATION_ADD: 12,
        IMAGE_BY_DATE: 13,
        ROUTE: 14,
    },
    INDIVIDUAL_IMAGE_MARKERS_VISIBLE: 15,
};

// 지도 클러스터링 옵션
export const MARKER_CLUSTER_OPTIONS = {
    maxZoom: ZOOM_SCALE.INDIVIDUAL_IMAGE_MARKERS_VISIBLE - 1,
    zoomOnClick: true,
    minimumClusterSize: 1,
    clickZoom: 2,
} as const;

// Polyline 환경
export const POLYLINE_OPTIONS: PolylineOption = {
    strokeColor: `${COLORS.PRIMARY}`,
    strokeOpacity: 0.7,
    strokeWeight: 0,
    icons: [
        {
            icon: {
                path: 'M 0,-1 0,1',
                scale: 3,
            },
            repeat: '12px',
        },
    ],
} as const;

// 기본 마커 환경
export const MARKER_ICON_CONFIG = {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: '#0073bb',
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 1.9,
    anchor: new window.google.maps.Point(12, 22),
} as const;

// 캐릭터 마커 환경
export const CHARACTER_ICON_CONFIG = {
    url: characterImage,
    scaledSize: { width: 45, height: 60 },
    anchorPoint: { x: 28, y: 50 },
} as const;
