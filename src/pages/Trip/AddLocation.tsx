// import { useState } from 'react';

// import { css } from '@emotion/react';
// import { GoCheckCircleFill } from 'react-icons/go';
// import { useLocation } from 'react-router-dom';

// import Button from '@/components/common/button/Button';
// import Header from '@/components/layout/Header';
// import { PAGE } from '@/constants/title';

// const AddLocation = () => {
//     const [selectedImages, setSelectedImages] = useState<string[]>([]);

//     const location = useLocation();
//     const { imagesNoLocation } = location.state;

//     const toggleImageSelection = (imageName: string) => {
//         setSelectedImages((prev) =>
//             prev.includes(imageName) ? prev.filter((image) => image !== imageName) : [...prev, imageName],
//         );
//     };

//     console.log(selectedImages);

//     return (
//         <div>
//             <Header title={PAGE.ADD_LOCATION} isBackButton />
//             <div>
//                 <Button text='다음' theme='sec' size='sm' />

//                 <div css={gridStyle}>
//                     {imagesNoLocation.map((image: File, index: number) => (
//                         <div key={index} css={imageContainerStyle} onClick={() => toggleImageSelection(image.name)}>
//                             <img src={URL.createObjectURL(image)} alt={`image-${index}`} css={imageStyle} />
//                             {selectedImages.includes(image.name) && (
//                                 <div css={selectedOverlayStyle}>
//                                     <GoCheckCircleFill css={checkIconStyle} />
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const gridStyle = css`
//     display: grid;
//     grid-template-columns: repeat(3, 1fr);
//     gap: 4px;
// `;

// const imageContainerStyle = css`
//     position: relative;
//     aspect-ratio: 1;
//     overflow: hidden;
//     cursor: pointer;
// `;

// const imageStyle = css`
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
// `;

// const selectedOverlayStyle = css`
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: rgba(0, 0, 0, 0.5);
//     display: flex;
//     justify-content: flex-end;
//     padding: 10px;
// `;

// const checkIconStyle = css`
//     color: white;
//     font-size: 20px;
// `;

// export default AddLocation;

import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { GoCheckCircleFill } from 'react-icons/go';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '@/components/common/button/Button';
import Header from '@/components/layout/Header';
import Map from '@/components/pages/addLocation/Map';
import { PATH } from '@/constants/path';
import { PAGE } from '@/constants/title';

const AddLocation = () => {
    const [displayImages, setDisplayImages] = useState<File[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showMap, setShowMap] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { imagesNoLocation } = location.state;

    useEffect(() => {
        setDisplayImages(imagesNoLocation);
    }, []);

    const toggleImageSelection = (imageFile: File) => {
        setSelectedImages((prev) => {
            const isSelected = prev.some((file) => file.name === imageFile.name);
            if (isSelected) {
                return prev.filter((file) => file.name !== imageFile.name);
            } else {
                return [...prev, imageFile];
            }
        });
    };

    const handleNextClick = () => {
        if (selectedImages.length > 0) {
            setShowMap(true);
        }
    };

    const handleSubmitClick = () => {
        navigate(PATH.TRIP_LIST);
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedLocation({ lat, lng });
    };

    const handleConfirmLocation = () => {
        if (!selectedLocation) {
            return;
        }

        console.log('Selected images:', selectedImages);
        console.log('Selected location:', selectedLocation);

        const updatedDisplayImages = displayImages.filter(
            (image) => !selectedImages.some((selected) => selected.name === image.name),
        );
        setDisplayImages(updatedDisplayImages);
        setSelectedImages([]);

        // 위치 정보 추가 후 이전 페이지로 돌아갑니다.
        setShowMap(false);
    };

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
                        <div css={gridStyle}>
                            {displayImages.map((image: File, index: number) => (
                                <div key={index} css={imageContainerStyle} onClick={() => toggleImageSelection(image)}>
                                    <img src={URL.createObjectURL(image)} alt={`image-${index}`} css={imageStyle} />
                                    {selectedImages.some((file) => file.name === image.name) && (
                                        <div css={selectedOverlayStyle}>
                                            <GoCheckCircleFill css={checkIconStyle} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
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

const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
`;

const imageContainerStyle = css`
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    cursor: pointer;
`;

const imageStyle = css`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const selectedOverlayStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: flex-end;
    padding: 10px;
`;

const checkIconStyle = css`
    color: white;
    font-size: 20px;
`;

export default AddLocation;
