import { useState } from 'react';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import { ENV } from '@/constants/auth';

interface MapProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

const center = {
    lat: 37.5665, // 서울의 위도
    lng: 126.978, // 서울의 경도
};

const Map = ({ onLocationSelect }: MapProps) => {
    const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);

    // const { isLoaded } = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: ENV.GOOGLE_MAPS_API_KEY,
    // });

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const newLocation = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };

            setSelectedLocation(newLocation);
            onLocationSelect(newLocation.lat, newLocation.lng);
        }
    };

    // if (!isLoaded) {
    //     return <div>Loading...</div>;
    // }

    return (
        <LoadScript googleMapsApiKey={ENV.GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onClick={handleMapClick}>
                {selectedLocation && <Marker position={selectedLocation} />}
            </GoogleMap>
        </LoadScript>
    );
};

const containerStyle = {
    width: '100%',
    height: '100vh',
};

export default Map;
