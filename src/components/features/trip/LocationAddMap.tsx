import { useState, useRef } from 'react';

import { css } from '@emotion/react';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { ChevronLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import { DEFAULT_ZOOM_SCALE, GOOGLE_MAPS_OPTIONS } from '@/constants/googleMaps';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';
import { LatLngLiteralType, MapMouseEventType, PlacesAutocompleteType } from '@/types/googleMaps';

interface LocationAddMapProps {
    onLocationSelect: (lat: number, lng: number) => void;
    setIsMapVisible: (isMapVisible: boolean) => void;
    isUploading: boolean;
    uploadImagesWithLocation: () => void;
}

const LocationAddMap = ({
    onLocationSelect,
    setIsMapVisible,
    isUploading,
    uploadImagesWithLocation,
}: LocationAddMapProps) => {
    const {
        defaultLocation: { latitude: lat, longitude: lng },
    } = useLocation().state;

    const [center, setCenter] = useState<LatLngLiteralType>({ lat, lng });
    const [selectedLocation, setSelectedLocation] = useState<LatLngLiteralType | null>(null);

    const showToast = useToastStore((state) => state.showToast);

    const { isLoaded, loadError, markerIcon } = useGoogleMaps();

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

    const handlePlaceChanged = () => {
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
            }
        }
    };

    if (loadError) {
        setIsMapVisible(false);
        showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
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
                    onPlaceChanged={handlePlaceChanged}
                    css={inputWrapper}
                >
                    <input type='text' placeholder='장소를 검색해주세요' css={inputStyle} />
                </Autocomplete>
            </div>
            <GoogleMap
                zoom={DEFAULT_ZOOM_SCALE.LOCATION_ADD}
                center={center}
                options={GOOGLE_MAPS_OPTIONS}
                mapContainerStyle={{ height: 'calc(100vh + 30px)' }}
                onClick={handleMapClick}
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
    width: calc(100% - 32px);
    max-width: 428px;
    height: 54px;
    position: absolute;
    top: 16px;
    left: 16px;
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

const buttonWrapper = css`
    width: 100vw;
    max-width: 428px;
    position: fixed;
    bottom: 0;
    padding: 16px;
    z-index: 1;
`;

export default LocationAddMap;
