import { useState, useEffect, Fragment, useMemo } from 'react';

import { css } from '@emotion/react';
import { Trash2 } from 'lucide-react';
import { FaPencilAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import MediaImageGrid from '@/components/features/image/MediaImageGrid';
import EditDate from '@/components/features/trip/EditDate';
import LocationAddMap from '@/components/features/trip/LocationAddMap';
import { ROUTES } from '@/constants/paths';
import { COLORS } from '@/constants/theme';
import { useToastStore } from '@/stores/useToastStore';
import { Location } from '@/types/location';
import { MediaFileMetaData, MediaFileWithDate } from '@/types/media';
import { formatToISOLocal, formatToKorean } from '@/utils/date';

const TripImageManagePage = () => {
    const [tripImages, setTripImages] = useState<MediaFileMetaData[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState<MediaFileMetaData[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [isVisibleEditList, setIsVisibleEditList] = useState(false);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [isDateVisible, setIsDateVisible] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isUploading, setIsUploading] = useState(false);

    const { showToast } = useToastStore.getState();

    const navigate = useNavigate();
    const { tripId } = useParams();

    useEffect(() => {
        const getTripImages = async () => {
            try {
                if (!tripId) return;

                const result = await tripImageAPI.getTripImages(tripId);

                if (result.isSuccess) {
                    setTripImages(result.data.mediaFiles);
                } else {
                    console.error(result.error);
                    navigate(-1);
                    showToast(result.error as string);
                }
            } catch (error) {
                showToast('사진을 불러오는데 실패하였습니다.');
            }
        };

        getTripImages();
    }, [tripId]);

    useEffect(() => {
        setIsVisibleEditList(false);
    }, [selectedImages.length]);

    useEffect(() => {
        if (!isMapVisible) {
            setSelectedLocation(null);
        }
    }, [selectedLocation, isMapVisible]);

    const imageGroupByDate = useMemo(() => {
        const group = tripImages.reduce<Record<string, MediaFileWithDate>>((acc, curr) => {
            const date = curr.recordDate.split('T')[0];

            if (!acc[date]) {
                acc[date] = { recordDate: date, images: [curr] };
            } else {
                acc[date].images = [...acc[date].images, curr];
            }

            return acc;
        }, {});

        return Object.values(group).sort(
            (dateA: MediaFileWithDate, dateB: MediaFileWithDate) =>
                new Date(dateA.recordDate).getTime() - new Date(dateB.recordDate).getTime(),
        );
    }, [tripImages]);

    const handleImageToggle = (selectedImage: MediaFileMetaData) => {
        const isAlreadySelected = selectedImages.some((image) => image.mediaFileId === selectedImage.mediaFileId);

        if (isAlreadySelected) {
            setSelectedImages((prev) => prev.filter((image) => image.mediaFileId !== selectedImage.mediaFileId));
        } else {
            setSelectedImages((prev) => [...prev, selectedImage]);
        }
    };

    const handleMapLocationSelect = (latitude: number, longitude: number) => {
        setSelectedLocation({ latitude, longitude });
    };

    const deleteImages = async (selectedImages: MediaFileMetaData[]) => {
        if (!tripId) return;
        try {
            await tripImageAPI.deleteImages(
                tripId,
                selectedImages.map((image) => image.mediaFileId),
            );

            setIsDeleteModalOpen(false);
            showToast(`${selectedImages.length}의 사진이 삭제되었습니다`);
            setSelectedImages([]);
            setIsSelectionMode(false);
        } catch (error) {
            console.error('여행 이미지 삭제 실패', error);
        }
    };

    const updateImagesLocation = async (selectedImages: MediaFileMetaData[], location: Location) => {
        if (!location || !tripId) return;

        const imagesWithUpdatedLocation = selectedImages.map((image) => {
            return {
                ...image,
                latitude: location.latitude,
                longitude: location.longitude,
            };
        });

        try {
            setIsUploading(true);
            await tripImageAPI.updateImages(tripId, imagesWithUpdatedLocation);

            setIsMapVisible(false);
            showToast(`${selectedImages.length}의 사진이 수정되었습니다`);
            setSelectedImages([]);
            setIsSelectionMode(false);
        } catch (error) {
            console.error('여행 이미지 삭제 실패', error);
        } finally {
            setIsUploading(false);
        }
    };

    const updateImagesDate = async (selectedImages: MediaFileMetaData[], date: Date | null) => {
        if (!date || !tripId) return;

        const imagesWithUpdatedDate = selectedImages.map((image) => {
            return {
                ...image,
                recordDate: formatToISOLocal(date),
            };
        });

        try {
            setIsUploading(true);
            await tripImageAPI.updateImages(tripId, imagesWithUpdatedDate);

            setIsDateVisible(false);
            showToast(`${selectedImages.length}장의 사진이 수정되었습니다`);
            setSelectedImages([]);
            setIsSelectionMode(false);
        } catch (error) {
            console.error('여행 이미지 삭제 실패', error);
        } finally {
            setIsUploading(false);
        }
    };

    const isSelectedImage = selectedImages.length > 0;

    if (!tripImages) return null;

    return isDateVisible ? (
        <EditDate
            defaultDate={selectedImages[0].recordDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isUploading={isUploading}
            uploadImagesWithDate={() => updateImagesDate(selectedImages, selectedDate)}
            setIsDateVisible={setIsDateVisible}
        />
    ) : isMapVisible ? (
        <LocationAddMap
            defaultLocation={{ latitude: tripImages[0].latitude, longitude: tripImages[0].longitude }}
            onLocationSelect={handleMapLocationSelect}
            setIsMapVisible={setIsMapVisible}
            isUploading={isUploading}
            uploadImagesWithLocation={() => updateImagesLocation(selectedImages, selectedLocation)}
        />
    ) : (
        <div css={container}>
            <Header title='사진 관리' isBackButton onBack={() => navigate(ROUTES.PATH.TRIPS.ROOT)} />
            <main css={mainStyle}>
                {imageGroupByDate?.map((image) => (
                    <Fragment key={image.recordDate}>
                        <h2 css={dateStyle}>{formatToKorean(image.recordDate.split('T')[0])}</h2>
                        <MediaImageGrid
                            images={image.images}
                            selectedImages={selectedImages}
                            onImageClick={isSelectionMode ? handleImageToggle : () => null}
                        />
                    </Fragment>
                ))}
            </main>

            <div css={bottomSheet}>
                {isSelectionMode ? (
                    <div css={selectedStyle}>
                        <p
                            css={selectedText}
                            onClick={() => {
                                setIsSelectionMode(false);
                                setSelectedImages([]);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            선택취소
                        </p>
                        <p css={selectedText}>
                            {isSelectedImage ? `${selectedImages.length}장의 사진이 선택됨` : '항목 선택'}
                        </p>
                        <div css={optionIcon}>
                            <Trash2
                                size={20}
                                color={isSelectedImage ? COLORS.PRIMARY : COLORS.TEXT.DESCRIPTION_LIGHT}
                                onClick={isSelectedImage ? () => setIsDeleteModalOpen(true) : () => null}
                                style={{
                                    cursor: isSelectedImage ? 'pointer' : 'default',
                                }}
                            />
                            <FaPencilAlt
                                size={16}
                                color={isSelectedImage ? COLORS.PRIMARY : COLORS.TEXT.DESCRIPTION_LIGHT}
                                onClick={isSelectedImage ? () => setIsVisibleEditList(!isVisibleEditList) : () => null}
                                style={{
                                    cursor: isSelectedImage ? 'pointer' : 'default',
                                }}
                            />
                            {isSelectedImage && isVisibleEditList && (
                                <div css={editList}>
                                    <h3 onClick={() => setIsMapVisible(true)}>위치 수정</h3>
                                    <div
                                        style={{
                                            width: 'calc(100% + 8px)',
                                            height: '1px',
                                            backgroundColor: `${COLORS.TEXT.DESCRIPTION_LIGHT}30`,
                                            margin: '12px 0',
                                            transform: 'translateX(-4px)',
                                        }}
                                    />
                                    <h3 onClick={() => setIsDateVisible(true)}>날짜 및 시간 수정</h3>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <Button text='사진 선택' variant='white' onClick={() => setIsSelectionMode(true)} />
                        <Button
                            text='새로운 사진 등록하기'
                            onClick={() => navigate(`${ROUTES.PATH.TRIPS.NEW.IMAGES(Number(tripId))}`)}
                        />
                    </>
                )}
            </div>

            {isDeleteModalOpen && (
                <ConfirmModal
                    title={`${selectedImages.length}장의 사진 삭제`}
                    description='삭제한 여행 사진은 다시 복구할 수 없습니다. 그래도 삭제하시겠습니까?'
                    confirmText='삭제'
                    cancelText='취소'
                    confirmModal={() => deleteImages(selectedImages)}
                    closeModal={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

const container = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow: auto;
    position: relative;
`;

const mainStyle = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-bottom: 108px;
`;

const selectedStyle = css`
    width: 100%;
    padding: 2px 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const bottomSheet = css`
    max-width: 428px;
    width: 100%;
    position: fixed;
    background-color: ${COLORS.BACKGROUND.WHITE};
    border-radius: 10px 10px 0 0;
    bottom: 0;
    padding: 12px;
    z-index: 10;
    display: flex;
    gap: 8px;
`;

const selectedText = css`
    font-weight: 600;
    color: ${COLORS.TEXT.BLACK};
`;

const optionIcon = css`
    position: relative;
    display: flex;
    gap: 14px;
    align-items: center;
`;

const editList = css`
    width: max-content;
    padding: 12px;
    position: absolute;
    top: -88px;
    right: -12px;
    display: flex;
    /* gap: 16px; */
    flex-direction: column;
    background-color: ${COLORS.BACKGROUND.WHITE};
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    cursor: pointer;
`;

const dateStyle = css`
    font-weight: bold;
    padding: 12px;
`;

export default TripImageManagePage;
