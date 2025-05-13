import { Marker as GoogleMapsMarker } from '@react-google-maps/api';

import { MARKER_ICON_CONFIG } from '@/shared/constants/map';
import { Location } from '@/shared/types/map';

interface MarkerProps {
    position: Location;
    isMapRendered?: boolean;
    isVisible?: boolean;
    isClick?: boolean;
    onClick?: () => void;
}

const Marker = ({ isClick, position, isMapRendered, isVisible = true, onClick }: MarkerProps) => {
    if (!isMapRendered || !isVisible) return null;

    return (
        <GoogleMapsMarker
            position={{ lat: position.latitude, lng: position.longitude }}
            icon={{ ...MARKER_ICON_CONFIG(isClick), anchor: new window.google.maps.Point(12, 22) }}
            onClick={onClick}
        />
    );
};

export default Marker;
