import { useState, useRef, useMemo } from 'react';

import { css } from '@emotion/react';
import { GoogleMap, Marker, Autocomplete, useLoadScript, Libraries } from '@react-google-maps/api';
import { ChevronLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import { GOOGLE_MAPS_CONFIG, GOOGLE_MAPS_OPTIONS, MARKER_ICON_CONFIG } from '@/constants/googleMaps';
import theme from '@/styles/theme';
import { LatLngLiteralType, MapMouseEventType, MapsType, PlacesAutocompleteType } from '@/types/googleMaps';

interface MapProps {
    onLocationSelect: (lat: number, lng: number) => void;
    setIsMapVisible: (isMapVisible: boolean) => void;
    isUploading: boolean;
    uploadImagesWithLocation: () => void;
}

const Map = ({ onLocationSelect, setIsMapVisible, isUploading, uploadImagesWithLocation }: MapProps) => {
    const { isLoaded, loadError } = useLoadScript(GOOGLE_MAPS_CONFIG);

    const {
        defaultLocation: { latitude: lat, longitude: lng },
    } = useLocation().state;

    const [center, setCenter] = useState<LatLngLiteralType>({ lat, lng });
    const [selectedLocation, setSelectedLocation] = useState<LatLngLiteralType | null>(null);
    const [map, setMap] = useState<MapsType>(null);

    const autocompleteRef = useRef<PlacesAutocompleteType>(null);

    const handleMapClick = (event: MapMouseEventType) => {
        if (event.latLng) {
            const newLocation = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };

            setSelectedLocation(newLocation);
            onLocationSelect(newLocation.lat, newLocation.lng);
        }
    };

    const onLoad = (mapInstance: MapsType) => {
        setMap(mapInstance);
    };

    // AutoComplete
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

    const markerIcon = useMemo(() => {
        if (!isLoaded || !window.google) {
            return;
        }
        return {
            ...MARKER_ICON_CONFIG,
            anchor: new window.google.maps.Point(12, 23),
        };
    }, [isLoaded]);

    if (loadError) {
        return <div>지도 불러오는 중 에러!!</div>;
    }

    if (!isLoaded) {
        return <Spinner />;
    }

    return (
        <div css={locationMapContainer}>
            <div css={inputContainer}>
                <button css={backButtonStyle} onClick={() => setIsMapVisible(false)} disabled={isUploading}>
                    <ChevronLeft size={24} color={`${theme.colors.descriptionText}`} />
                </button>
                <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={onPlaceChanged}
                    css={inputWrapper}
                >
                    <input type='text' placeholder='장소를 검색하세요' css={inputStyle} />
                </Autocomplete>
                <style>{autocompleteDropdownStyle}</style>
            </div>
            <GoogleMap
                zoom={12}
                center={center}
                options={GOOGLE_MAPS_OPTIONS}
                mapContainerStyle={{ height: 'calc(100vh + 30px)' }}
                onClick={handleMapClick}
                onLoad={onLoad}
            >
                {selectedLocation && <Marker position={selectedLocation} icon={markerIcon || undefined} />}
            </GoogleMap>
            <div css={buttonWrapper}>
                <Button
                    text='위치 등록하기'
                    onClick={uploadImagesWithLocation}
                    disabled={!selectedLocation}
                    isLoading={isUploading}
                    loadingText='위치를 등록하고 있습니다'
                />
            </div>
        </div>
    );
};

const locationMapContainer = css`
    position: relative;
`;

const inputContainer = css`
    width: 90%;
    max-width: 428px;
    height: 54px;
    position: absolute;
    top: 20px;
    left: 5%;
    z-index: 1;
    display: flex;
    background-color: ${theme.colors.modalBg};
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const inputWrapper = css`
    width: 100%;
`;

const inputStyle = css`
    width: 100%;
    height: 100%;
    padding: 0 20px 0 12px;
    border: 0;
`;

const backButtonStyle = css`
    width: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 0;
    cursor: pointer;

    &:hover {
        background-color: #f0f0f0;
    }
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

const buttonWrapper = css`
    position: fixed;
    width: 100vw;
    border-radius: 20px 20px 0 0;
    max-width: 428px;
    bottom: 0;
    padding: 16px;
    z-index: 1000;
`;

export default Map;
