import { Marker } from '@react-google-maps/api';

import characterImage from '/character.png';
import planeImage from '/plane-icon.png';
import carImage from '/car-icon.png';

import { Location } from '@/shared/types/map';

interface CharacterMarkerProps {
    position: Location;
    isMapRendered: boolean;
    transportType?: string;
}

const CharacterMarker = ({ position, isMapRendered, transportType = 'walking' }: CharacterMarkerProps) => {
    if (!isMapRendered) {
        return;
    }

    const getMarkerImage = () => {
        switch (transportType) {
            case 'car':
                return {
                    url: carImage,
                    scaledSize: new window.google.maps.Size(55, 50),
                    anchor: new window.google.maps.Point(22, 32),
                };
            case 'plane':
                return {
                    url: planeImage,
                    scaledSize: new window.google.maps.Size(45, 45),
                    anchor: new window.google.maps.Point(28, 28),
                };
            default:
                return {
                    url: characterImage,
                    scaledSize: new window.google.maps.Size(45, 60),
                    anchor: new window.google.maps.Point(28, 50),
                };
        }
    };

    return (
        <Marker position={{ lat: position.latitude, lng: position.longitude }} icon={getMarkerImage()} zIndex={1000} />
    );
};

export default CharacterMarker;
