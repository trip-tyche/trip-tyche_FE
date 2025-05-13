import { memo } from 'react';

import { Marker as GoogleMapsMarker } from '@react-google-maps/api';

import { COLORS } from '@/shared/constants/theme';
import { Location } from '@/shared/types/map';

interface MarkerProps {
    position: Location;
    isMapRendered?: boolean;
    isVisible?: boolean;
    isClick?: boolean;
    onClick?: () => void;
}

const Marker = memo(({ isClick, position, isMapRendered, isVisible = true, onClick }: MarkerProps) => {
    if (!isMapRendered || !isVisible) return null;

    const options = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: isClick ? COLORS.PRIMARY_HOVER : COLORS.PRIMARY,
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 1,
        scale: isClick ? 2 : 1.9,
        anchor: new window.google.maps.Point(12, 22),
    };

    return (
        <GoogleMapsMarker
            position={{ lat: position.latitude, lng: position.longitude }}
            icon={options}
            onClick={onClick}
        />
    );
});

export default Marker;
