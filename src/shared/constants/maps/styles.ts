import characterImage from '/character-1.png';

import { PolylineOption } from '@/shared/types/map';
import { COLORS } from '@/shared/constants/theme';

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
    scaledSize: { width: 45, height: 60 },
    anchorPoint: { x: 28, y: 50 },
} as const;

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
