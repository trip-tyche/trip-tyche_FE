import { useState, useRef, useMemo } from 'react';

import { css } from '@emotion/react';
import { GoogleMap, Marker, Autocomplete, useLoadScript, Libraries } from '@react-google-maps/api';
import { ChevronLeft } from 'lucide-react';

import Loading from '@/components/common/Loading';
import { ENV } from '@/constants/api';
import theme from '@/styles/theme';

interface Location {
    latitude: number;
    longitude: number;
}

interface MapProps {
    onLocationSelect: (lat: number, lng: number) => void;
    defaultLocation: Location;
    setIsMapVisible: (isMapVisible: boolean) => void;
    isUploading: boolean;
}

const libraries: Libraries = ['places'];

const Map = ({ onLocationSelect, defaultLocation, setIsMapVisible, isUploading }: MapProps) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: ENV.GOOGLE_MAPS_API_KEY || '',
        libraries, // 상수 참조
    });

    const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const [center, setCenter] = useState<google.maps.LatLngLiteral>({
        lat: defaultLocation.latitude,
        lng: defaultLocation.longitude,
    });
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const mapOptions: google.maps.MapOptions = {
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: false,
        streetViewControl: false,
        rotateControl: false,
        clickableIcons: false,
    };

    const markerIcon = useMemo(() => {
        if (isLoaded) {
            return {
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                fillColor: '#0073bb',
                fillOpacity: 1,
                strokeWeight: 1,
                rotation: 0,
                scale: 1.5,
                anchor: new google.maps.Point(12, 23),
            };
        }
        return null;
    }, [isLoaded]);

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

    const onLoad = (mapInstance: google.maps.Map) => {
        setMap(mapInstance);
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry && place.geometry.location) {
                const newLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };
                setCenter(newLocation);
                setSelectedLocation(newLocation);
                onLocationSelect(newLocation.lat, newLocation.lng);
                map?.panTo(newLocation);
            }
        }
    };

    if (loadError) {
        return <div>Map cannot be loaded right now, sorry.</div>;
    }

    if (!isLoaded) {
        return (
            <div css={loadingSpinnerStyle}>
                <Loading />
            </div>
        );
    }

    return (
        <div css={mapContainerStyle}>
            <div css={searchOuterContainerStyle}>
                <div css={searchContainerStyle}>
                    <div css={searchWrapperStyle}>
                        <button css={backButtonStyle} onClick={() => setIsMapVisible(false)} disabled={isUploading}>
                            <ChevronLeft size={24} color={`${theme.colors.descriptionText}`} />
                        </button>
                        <Autocomplete
                            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                            onPlaceChanged={onPlaceChanged}
                        >
                            <input type='text' placeholder='장소를 검색하세요' css={searchInputStyle} />
                        </Autocomplete>
                    </div>
                </div>
            </div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                options={mapOptions}
                onClick={handleMapClick}
                onLoad={onLoad}
            >
                {selectedLocation && <Marker position={selectedLocation} icon={markerIcon || undefined} />}
            </GoogleMap>
            <style>{autocompleteDropdownStyle}</style>
        </div>
    );
};

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const mapContainerStyle = css`
    position: relative;
    width: 100%;
`;

const searchOuterContainerStyle = css`
    position: absolute;
    top: 20px;
    left: 0;
    width: 100%;
    z-index: 10;
`;

const searchContainerStyle = css`
    width: 90%;
    max-width: 600px;
    margin: 0 auto;
`;

const searchWrapperStyle = css`
    display: flex;
    height: 54px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const backButtonStyle = css`
    width: 54px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 0;
    border-radius: 10px 0 0 10px;
    cursor: pointer;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const searchInputStyle = css`
    flex-grow: 1;
    height: 100%;
    padding: 0 20px;
    border: 0;
    border-radius: 0 10px 10px 0;
    font-size: 16px;
    outline: none;
`;

const autocompleteDropdownStyle = `
    .pac-container {
        border-radius: 10px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        border: none;
        font-family: Arial, sans-serif;
        margin-top: -20px;
        width: 90% !important;
        max-width: calc(428px * 0.9);
        left: 50% !important;
        transform: translateX(-50%) !important;
        margin-top: 4px;
    }

    .pac-item {
        padding: 10px 15px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .pac-item:hover {
        background-color: #f0f0f0;
    }

    .pac-item-query {
        font-size: 16px;
        color: #333;
    }

    .pac-matched {
        font-weight: bold;
    }

    .pac-icon {
        display:none;
    }
`;

const loadingSpinnerStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100dvh;
    background-color: #f0f0f0;
`;

export default Map;
