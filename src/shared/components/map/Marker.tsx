import { Marker as GoogleMapsMarker } from '@react-google-maps/api';

import { MARKER_ICON_CONFIG } from '@/shared/constants/map';
import { Location } from '@/shared/types/map';

interface MarkerProps {
    position: Location;
    isMapLoaded?: boolean;
    isVisible?: boolean;
    onClick?: () => void;
}

const Marker = ({ position, isMapLoaded, isVisible = true, onClick }: MarkerProps) => {
    if (!isMapLoaded) {
        return;
    }

    if (!isVisible) return null;

    return (
        <GoogleMapsMarker
            position={{ lat: position.latitude, lng: position.longitude }}
            icon={MARKER_ICON_CONFIG}
            onClick={onClick}
        />
    );
};

export default Marker;
