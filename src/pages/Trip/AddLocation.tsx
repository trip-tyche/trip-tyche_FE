import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import piexif from 'piexifjs';
import { GoCheckCircleFill } from 'react-icons/go';
import { useLocation, useNavigate } from 'react-router-dom';

import { postTripImages } from '@/api/trip';
import Button from '@/components/common/button/Button';
import Header from '@/components/layout/Header';
import Map from '@/components/pages/addLocation/Map';
import { PATH } from '@/constants/path';
import { PAGE } from '@/constants/title';
import { createGpsExif, insertExifIntoJpeg, readFileAsDataURL } from '@/utils/piexif';

const AddLocation = () => {
    const [displayedImages, setDisplayedImages] = useState<File[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [updatedImages, setUpdatedImages] = useState<File[]>([]);

    const navigate = useNavigate();
    const location = useLocation();
    const { imagesNoLocation } = location.state;

    useEffect(() => {
        setDisplayedImages(imagesNoLocation);
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

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedLocation({ lat, lng });
    };

    const handleSubmitClick = async () => {
        try {
            await postTripImages('1', updatedImages);
            navigate(PATH.TRIP_LIST);
        } catch (error) {
            console.error('Error post trip-images:', error);
        }
    };

    const handleConfirmLocation = async () => {
        if (!selectedLocation) {
            console.warn('Location is not selected.');
            return;
        }

        console.log('Selected images:', selectedImages);
        console.log('Selected location:', selectedLocation);

        const updatedImages = await Promise.all(
            selectedImages.map(async (image) => {
                const exifObj = piexif.load(await readFileAsDataURL(image));
                const gpsExif = createGpsExif(selectedLocation.lat, selectedLocation.lng);

                const newExif = { ...exifObj, ...gpsExif };
                const exifStr = piexif.dump(newExif);

                const newImageBlob = await insertExifIntoJpeg(image, exifStr);
                return new File([newImageBlob], image.name, { type: image.type });
            }),
        );

        setUpdatedImages(updatedImages);
        // 업데이트된 이미지들을 처리 (예: 서버에 업로드 또는 상태 업데이트)
        console.log('Images with updated location:', updatedImages);

        const updatedDisplayedImages = displayedImages.filter(
            (image) => !selectedImages.some((selected) => selected.name === image.name),
        );

        setDisplayedImages(updatedDisplayedImages);
        setSelectedImages([]);

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
                            {displayedImages.map((image: File, index: number) => (
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
