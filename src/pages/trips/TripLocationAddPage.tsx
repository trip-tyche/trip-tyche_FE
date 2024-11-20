import ImageListByDate from '@/components/features/image/ImageListByDate';
import Map from '@/components/features/trip/Map';
import { useAddLocation } from '@/hooks/useAddLocation';

const TripLocationAddPage = () => {
    const {
        tripId,
        imageGroupByDate,
        selectedImages,
        isMapVisible,
        setIsMapVisible,
        isUploading,
        toggleImageSelection,
        handleMapLocationSelect,
        uploadImagesWithLocation,
    } = useAddLocation();

    return !isMapVisible ? (
        <ImageListByDate
            imageGroupByDate={imageGroupByDate}
            selectedImages={selectedImages}
            toggleImageSelect={toggleImageSelection}
            setIsMapVisible={setIsMapVisible}
            tripId={tripId}
        />
    ) : (
        <Map
            onLocationSelect={handleMapLocationSelect}
            setIsMapVisible={setIsMapVisible}
            isUploading={isUploading}
            uploadImagesWithLocation={uploadImagesWithLocation}
        />
    );
};

export default TripLocationAddPage;
