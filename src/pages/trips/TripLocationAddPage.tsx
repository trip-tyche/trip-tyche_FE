import ImageListByDate from '@/components/features/image/ImageListByDate';
import LocationAddMap from '@/components/features/trip/LocationAddMap';
import { useLocationAdd } from '@/hooks/useLocationAdd';

const TripLocationAddPage = () => {
    const {
        tripKey,
        imageGroupByDate,
        defaultLocation,
        selectedImages,
        isMapVisible,
        setIsMapVisible,
        isUploading,
        handleHashtagSelect,
        handleMapLocationSelect,
        uploadImagesWithLocation,
    } = useLocationAdd();

    return !isMapVisible ? (
        <ImageListByDate
            imageGroupByDate={imageGroupByDate}
            selectedImages={selectedImages}
            onHashtagSelect={handleHashtagSelect}
            setIsMapVisible={setIsMapVisible}
            tripKey={tripKey}
        />
    ) : (
        <LocationAddMap
            defaultLocation={defaultLocation}
            onLocationSelect={handleMapLocationSelect}
            setIsMapVisible={setIsMapVisible}
            isUploading={isUploading}
            uploadImagesWithLocation={uploadImagesWithLocation}
        />
    );
};

export default TripLocationAddPage;
