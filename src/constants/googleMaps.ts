import { Libraries } from '@react-google-maps/api';

import { ENV } from '@/constants/api';
import { MapOptionsType } from '@/types/googleMaps';

export const GOOGLE_MAPS_CONFIG = {
    googleMapsApiKey: ENV.GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'] as Libraries,
    language: 'ko',
    region: 'KR',
} as const;

// 지도 옵션
export const GOOGLE_MAPS_OPTIONS: MapOptionsType = {
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: false,
    streetViewControl: false,
    rotateControl: true,
    clickableIcons: false,
} as const;

// 마커 아이콘 설정
export const MARKER_ICON_CONFIG = {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: '#0073bb',
    fillOpacity: 1,
    strokeWeight: 1,
    rotation: 0,
    scale: 1.5,
} as const;

// 지도 기본 위치
export const GOOGLE_MAPS_DEFAULT_CENTER = {
    lat: 37.5665,
    lng: 126.978,
} as const;

export const GOOGLE_MAPS_DEFAULT_ZOOM = 12;
