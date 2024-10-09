import { useMemo } from 'react';

import { css } from '@emotion/react';

import Button from '@/components/common/button/Button';
import Toast from '@/components/common/Toast';
import DateGroupedImageList from '@/components/pages/addLocation/DateGroupedImageList';
import Map from '@/components/pages/addLocation/Map';
import { useAddLocation } from '@/hooks/useAddLocation';

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

interface ImageWithDate {
    file: File;
    formattedDate: string; // YYYY-MM-DD 형식
}

const AddLocation = () => {
    const {
        defaultLocation,
        displayedImages,
        selectedImages,
        selectedLocation,
        showMap,
        setShowMap,
        isLoading,
        toggleImageSelection,
        goToTripList,
        handleNextClick,
        handleLocationSelect,
        handleConfirmLocation,
    } = useAddLocation();

    const groupedImages = useMemo(() => {
        const groups: Record<string, ImageWithDate[]> = displayedImages.reduce(
            (acc, image) => {
                const date = image.formattedDate;
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(image);
                return acc;
            },
            {} as Record<string, ImageWithDate[]>,
        );

        return Object.entries(groups).sort(([dateA], [dateB]) => dateA.localeCompare(dateB));
    }, [displayedImages]);

    return (
        <div css={containerStyle}>
            <div>
                {!showMap ? (
                    <section css={sectionStyle}>
                        <DateGroupedImageList
                            groupedImages={groupedImages}
                            selectedImages={selectedImages}
                            toggleImageSelection={toggleImageSelection}
                        />
                        <div css={buttonWrapper}>
                            <Button text='홈으로 가기' btnTheme='sec' size='lg' onClick={goToTripList} />
                            <Button
                                text='지도에서 위치 선택하기'
                                btnTheme='pri'
                                size='lg'
                                onClick={handleNextClick}
                                disabled={selectedImages.length === 0}
                            />
                        </div>
                    </section>
                ) : (
                    <section css={sectionStyle}>
                        <div css={mapButtonWrapper}>
                            <Button
                                text='위치 등록하기'
                                btnTheme='sec'
                                size='lg'
                                onClick={handleConfirmLocation}
                                disabled={!selectedLocation}
                                isLoading={isLoading}
                                loadingMessage='위치를 넣는 중입니다...'
                            />
                        </div>
                        <Map
                            onLocationSelect={handleLocationSelect}
                            defaultLocation={defaultLocation}
                            setShowMap={setShowMap}
                        />
                    </section>
                )}
            </div>
            <Toast />
        </div>
    );
};

const containerStyle = css`
    position: relative;
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

export default AddLocation;
