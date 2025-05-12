import { Marker } from '@react-google-maps/api';

import { CHARACTER_ICON_CONFIG } from '@/shared/constants/map';
import { Location } from '@/shared/types/map';

const CharacterMarker = ({ position, isMapLoaded }: { position: Location; isMapLoaded: boolean }) => {
    if (!isMapLoaded) {
        return;
    }

    const icon = {
        url: CHARACTER_ICON_CONFIG.url,
        scaledSize: new window.google.maps.Size(
            CHARACTER_ICON_CONFIG.scaledSize.width,
            CHARACTER_ICON_CONFIG.scaledSize.height,
        ),
        anchor: new window.google.maps.Point(CHARACTER_ICON_CONFIG.anchorPoint.x, CHARACTER_ICON_CONFIG.anchorPoint.y),
    };

    return <Marker position={{ lat: position.latitude, lng: position.longitude }} icon={icon} zIndex={1000} />;
};

export default CharacterMarker;
