import { useMemo } from 'react';

import { css } from '@emotion/react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '@/components/common/button/Button';
import DateGroupedImageList from '@/components/pages/addLocation/DateGroupedImageList';
import Map from '@/components/pages/addLocation/Map';
import { PATH } from '@/constants/path';
import { useAddLocation } from '@/hooks/useAddLocation';
import { useEditingStore } from '@/stores/useEditingStore';
import { useToastStore } from '@/stores/useToastStore';
import { ImageModel } from '@/types/image';

// const AddLocation = () => {
//     const {
//         defaultLocation,
//         displayedImages,
//         selectedImages,
//         selectedLocation,
//         showMap,
//         setShowMap,
//         isLoading,
//         toggleImageSelection,
//         goToTripList,
//         handleNextClick,
//         handleLocationSelect,
//         handleConfirmLocation,
//     } = useAddLocation();

//     const filteredByDate = displayedImages.filter((image) => image.formattedDate === '2023-07-28');
//     console.log(filteredByDate);

//     return (
//         <div css={containerStyle}>
//             <div>
//                 {!showMap ? (
//                     <>
//                         <Header title={PAGE.ADD_LOCATION} isBackButton />
//                         <section css={sectionStyle}>
//                             <div>
//                                 {/* <h2>{formattedDate}</h2> */}
//                                 <ImageGrid
//                                     displayedImages={displayedImages}
//                                     selectedImages={selectedImages}
//                                     toggleImageSelection={toggleImageSelection}
//                                 />
//                             </div>

const TripLocationAddPage = () => {
    const showToast = useToastStore((state) => state.showToast);
    const { isEditing, setIsEditing } = useEditingStore();

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

    const navigate = useNavigate();
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

    const handleSetLocationOnMap = () => {
        if (selectedImages.length > 0) {
            setIsMapVisible(true);
        }
    };

    const navigateToTripInfo = () => {
        if (isEditing) {
            navigate(`${PATH.TRIPS.ROOT}`);
            showToast(`사진이 등록되었습니다.`);
            setIsEditing(false);
        } else {
            navigate(`${PATH.TRIPS.NEW.INFO(Number(tripId))}`);
        }
    };

    return (
        <div css={containerStyle}>
            <div>
                {!isMapVisible ? (
                    <section css={sectionStyle}>
                        <DateGroupedImageList
                            groupedImages={groupedImages}
                            selectedImages={selectedImages}
                            toggleImageSelect={toggleImageSelect}
                        />
                        <div css={buttonWrapper}>
                            <Button text='건너뛰고 계속하기' btnTheme='sec' size='lg' onClick={navigateToTripInfo} />
                            <Button
                                text='위치 설정하기'
                                btnTheme='pri'
                                size='lg'
                                onClick={handleSetLocationOnMap}
                                disabled={selectedImages.length === 0}
                            />
                        </div>
                    </section>
                ) : (
                    <section css={sectionStyle}>
                        <div css={mapButtonWrapper}>
                            <Button
                                text='선택한 위치 등록하기'
                                btnTheme='pri'
                                size='lg'
                                onClick={handleImageUploadWithLocation}
                                disabled={!selectedLocation}
                                isLoading={isUploading}
                                loadingMessage='위치 등록 중입니다...'
                            />
                        </div>
                        <Map
                            onLocationSelect={handleLocationSelect}
                            defaultLocation={defaultLocation}
                            setIsMapVisible={setIsMapVisible}
                            isUploading={isUploading}
                        />
                    </section>
                )}
            </div>
        </div>
    );
};

const containerStyle = css`
    position: relative;
    height: 100dvh;
`;

const sectionStyle = css`
    position: relative;
    display: flex;
    flex-direction: column;
`;

const buttonWrapper = css`
    position: fixed;
    background-color: white;
    border-radius: 20px 20px 0 0;
    width: 100vw;
    max-width: 428px;
    bottom: 0;
    padding: 12px;
    z-index: 1000;
    display: flex;
    gap: 8px;
`;

const mapButtonWrapper = css`
    position: fixed;
    width: 100vw;
    border-radius: 20px 20px 0 0;
    max-width: 428px;
    bottom: 0;
    padding: 20px;
    z-index: 1000;
`;

export default TripLocationAddPage;
