import { useMemo } from 'react';

import { css } from '@emotion/react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import DateGroupedImageList from '@/components/features/image/DateGroupedImageList';
import Map from '@/components/features/trip/Map';
import { PATH } from '@/constants/path';
import { useAddLocation } from '@/hooks/useAddLocation';
import { useToastStore } from '@/stores/useToastStore';
import useUserDataStore from '@/stores/useUserDataStore';
import theme from '@/styles/theme';
import { ImageModel } from '@/types/image';

const TripLocationAddPage = () => {
    const {
        tripId,
        displayedImages,
        selectedImages,
        selectedLocation,
        isMapVisible,
        setIsMapVisible,
        isUploading,
        toggleImageSelect,
        handleLocationSelect,
        handleImageUploadWithLocation,
    } = useAddLocation();

    const location = useLocation();
    const { defaultLocation } = location.state;

    const groupedImages = useMemo(() => {
        const groups: Record<string, ImageModel[]> = displayedImages.reduce(
            (acc, image) => {
                const date = image.formattedDate;
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(image);
                return acc;
            },
            {} as Record<string, ImageModel[]>,
        );

        return Object.entries(groups).sort(([dateA], [dateB]) => dateA.localeCompare(dateB));
    }, [displayedImages]);

    return (
        <div>
            <></>
            {!isMapVisible ? (
                <DateGroupedImageList
                    groupedImages={groupedImages}
                    selectedImages={selectedImages}
                    toggleImageSelect={toggleImageSelect}
                    setIsMapVisible={setIsMapVisible}
                    tripId={tripId}
                />
            ) : (
                <Map
                    onLocationSelect={handleLocationSelect}
                    defaultLocation={defaultLocation}
                    setIsMapVisible={setIsMapVisible}
                    isUploading={isUploading}
                    handleImageUploadWithLocation={handleImageUploadWithLocation}
                />
            )}
        </div>
    );
};

export default TripLocationAddPage;
