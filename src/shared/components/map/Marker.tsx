import { Marker as GoogleMapsMarker } from '@react-google-maps/api';

import { MARKER_ICON_CONFIG } from '@/shared/constants/maps/styles';
import { Location } from '@/shared/types/map';

interface MarkerProps {
    position: Location;
    isMapLoaded?: boolean;
    onClick?: () => void;
}

const Marker = ({ position, isMapLoaded, onClick }: MarkerProps) => {
    if (!isMapLoaded) {
        return;
    }

    const icon = {
        ...MARKER_ICON_CONFIG,
        anchor: new window.google.maps.Point(12, 23),
    };

    return (
        <GoogleMapsMarker
            position={{ lat: position.latitude, lng: position.longitude }}
            icon={icon}
            onClick={onClick}
        />
    );
};

export default Marker;
