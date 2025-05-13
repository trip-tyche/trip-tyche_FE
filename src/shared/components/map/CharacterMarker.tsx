import { Marker } from '@react-google-maps/api';

import characterImage from '/character-1.png';

import { Location } from '@/shared/types/map';

const CharacterMarker = ({ position, isMapRendered }: { position: Location; isMapRendered: boolean }) => {
    if (!isMapRendered) {
        return;
    }

    const icon = {
        url: characterImage,
        scaledSize: new window.google.maps.Size(45, 60),
        anchor: new window.google.maps.Point(28, 50),
    };

    return <Marker position={{ lat: position.latitude, lng: position.longitude }} icon={icon} zIndex={1000} />;
};

export default CharacterMarker;
