import Button from '@/components/common/button/Button';
import Header from '@/components/layout/Header';
import ImageGrid from '@/components/pages/addLocation/ImageGrid';
import Map from '@/components/pages/addLocation/Map';
import { PAGE } from '@/constants/title';
import { useAddLocation } from '@/hooks/useAddLocation';

const AddLocation = () => {
    const {
        displayedImages,
        selectedImages,
        selectedLocation,
        showMap,
        toggleImageSelection,
        handleNextClick,
        handleLocationSelect,
        handleSubmitClick,
        handleConfirmLocation,
    } = useAddLocation();

    return (
        <div>
            <Header title={PAGE.ADD_LOCATION} isBackButton />
            <div>
                {!showMap ? (
                    <>
                        <Button
                            text='다음'
                            theme='sec'
                            size='sm'
                            onClick={handleNextClick}
                            disabled={selectedImages.length === 0}
                        />
                        <Button text='완료' theme='sec' size='sm' onClick={handleSubmitClick} />
                        <ImageGrid
                            displayedImages={displayedImages}
                            selectedImages={selectedImages}
                            toggleImageSelection={toggleImageSelection}
                        />
                    </>
                ) : (
                    <>
                        <Button
                            text='위치 확인'
                            theme='sec'
                            size='sm'
                            onClick={handleConfirmLocation}
                            disabled={!selectedLocation}
                        />
                        <Map onLocationSelect={handleLocationSelect} />
                    </>
                )}
            </div>
        </div>
    );
};

export default AddLocation;