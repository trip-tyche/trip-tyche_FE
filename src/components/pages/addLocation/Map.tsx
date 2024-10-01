import { useState } from 'react';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import { ENV } from '@/constants/auth';

interface Location {
    latitude: number;
    longitude: number;
}

interface MapProps {
    onLocationSelect: (lat: number, lng: number) => void;
    defaultLocation: Location;
}

const Map = ({ onLocationSelect, defaultLocation }: MapProps) => {
    const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);

    const center: google.maps.LatLngLiteral = {
        lat: defaultLocation.latitude,
        lng: defaultLocation.longitude,
    };

    const mapOptions: google.maps.MapOptions = {
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: false,
        streetViewControl: false,
        rotateControl: false,
        clickableIcons: false,
    };

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

    return (
        <LoadScript googleMapsApiKey={ENV.GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                options={mapOptions}
                onClick={handleMapClick}
            >
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
