import { useState, useRef, useEffect } from 'react';

import { css } from '@emotion/react';
import { GoogleMap, Autocomplete } from '@react-google-maps/api';
import { ChevronLeft } from 'lucide-react';

import Button from '@/shared/components/common/Button';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import Marker from '@/shared/components/map/Marker';
import { ZOOM_SCALE, MAPS_OPTIONS, DEFAULT_CENTER } from '@/shared/constants/map';
import { useMapControl } from '@/shared/hooks/useMapControl';
import { useToastStore } from '@/shared/stores/useToastStore';
import theme from '@/shared/styles/theme';
import { Location, LatLng, MapMouseEvent, PlacesAutocomplete, MapType } from '@/shared/types/map';

interface LocationAddMapProps {
    defaultLocation: Location;
    onLocationSelect: (lat: number, lng: number) => void;
    setIsMapVisible: (isMapVisible: boolean) => void;
    isUploading?: boolean;
    uploadImagesWithLocation: () => void;
}

const LocationAddMap = ({
    defaultLocation,
    onLocationSelect,
    setIsMapVisible,
    isUploading,
    uploadImagesWithLocation,
}: LocationAddMapProps) => {
    const { latitude: lat, longitude: lng } = defaultLocation;

    const [center, setCenter] = useState<LatLng>({ lat, lng });
    const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);

    const showToast = useToastStore((state) => state.showToast);

    const { isMapScriptLoaded, isMapScriptLoadError } = useMapControl(ZOOM_SCALE.LOCATION_ADD, DEFAULT_CENTER);

    useEffect(() => {
        setSelectedLocation({ lat, lng });
    }, []);

    const autocompleteRef = useRef<PlacesAutocomplete>(null);
    const mapRef = useRef<MapType | null>(null);

    const handleMapClick = (event: MapMouseEvent) => {
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

    if (isMapScriptLoadError) {
        setIsMapVisible(false);
        showToast('지도를 불러오는데 실패했습니다, 다시 시도해주세요');
    }

    if (!isMapScriptLoaded) {
        return <Indicator />;
    }

    return (
        <div css={locationMapContainer}>
            <div css={inputContainer}>
                <button css={backButtonStyle} onClick={() => setIsMapVisible(false)} disabled={isUploading}>
                    <ChevronLeft size={24} color={`${theme.COLORS.TEXT.DESCRIPTION}`} />
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
                zoom={ZOOM_SCALE.LOCATION_ADD}
                center={center}
                options={MAPS_OPTIONS}
                mapContainerStyle={{ height: 'calc(100vh + 30px)' }}
                onClick={handleMapClick}
            >
                {/* {selectedLocation && <Marker position={selectedLocation} icon={markerIcon || undefined} />} */}
                {selectedLocation && (
                    <Marker
                        mapRef={mapRef}
                        position={{ latitude: selectedLocation.lat, longitude: selectedLocation.lng }}
                    />
                )}
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
    background-color: ${theme.COLORS.BACKGROUND.WHITE};
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
