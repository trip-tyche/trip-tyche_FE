import { useState, useEffect, Fragment, useMemo } from 'react';

import { css } from '@emotion/react';
import { Trash2 } from 'lucide-react';
import { GoKebabHorizontal } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import MediaImageGrid from '@/components/features/image/MediaImageGrid';
import { ROUTES } from '@/constants/paths';
import { COLORS } from '@/constants/theme';
import { useToastStore } from '@/stores/useToastStore';
import { MediaFile, MediaFileWithDate } from '@/types/media';
import { formatToKorean } from '@/utils/date';

const TripImageManagePage = () => {
    const [tripImages, setTripImages] = useState<MediaFile[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState<MediaFile[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { showToast } = useToastStore.getState();

    const navigate = useNavigate();
    const { tripId } = useParams();

    useEffect(() => {
        const getTripImages = async () => {
            try {
                if (!tripId) return;

                const response = await tripImageAPI.getTripImages(tripId);
                setTripImages(response.mediaFiles);
            } catch (error) {
                console.error('여행 이미지 조회 실패', error);
                // TODO: 에러 처리 추가
            }
        };

        getTripImages();
    }, [tripId]);

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

    const handleImageToggle = (selectedImage: MediaFile) => {
        const isAlreadySelected = selectedImages.some((image) => image.mediaFileId === selectedImage.mediaFileId);

        if (isAlreadySelected) {
            setSelectedImages((prev) => prev.filter((image) => image.mediaFileId !== selectedImage.mediaFileId));
        } else {
            setSelectedImages((prev) => [...prev, selectedImage]);
        }
    };

    // const handleDeleteImages = async (imagesToDelete: MediaFile[]) => {
    //     try {
    //         // TODO: API 호출로 이미지 삭제 구현
    //         // await tripImageAPI.deleteImages(imagesToDelete.map(img => img.mediaFileId));

    //         setTripImages((prev) =>
    //             prev.filter(
    //                 (image) => !imagesToDelete.some((deleteImage) => deleteImage.mediaFileId === image.mediaFileId),
    //             ),
    //         );
    //         setSelectedImages([]);
    //         setIsSelectionMode(false);
    //     } catch (error) {
    //         console.error('Failed to delete images:', error);
    //         // TODO: 에러 처리 추가
    //     }
    // };

    const deleteImages = async (selectedImages: MediaFile[]) => {
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

    if (!tripImages) return null;
    const isSelectedImage = selectedImages.length > 0;

    return (
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
                            <div onClick={isSelectedImage ? () => console.log('삭제') : () => null}>
                                <GoKebabHorizontal
                                    size={18}
                                    color={isSelectedImage ? COLORS.PRIMARY : COLORS.TEXT.DESCRIPTION_LIGHT}
                                    style={{
                                        transform: 'rotate(90deg)',
                                        cursor: isSelectedImage ? 'pointer' : 'default',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <Button text='사진 선택' variant='white' onClick={() => setIsSelectionMode(true)} />
                        <Button text='새로운 사진 등록하기' />
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
    min-width: 428px;
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
    display: flex;
    gap: 14px;
`;

const dateStyle = css`
    font-weight: bold;
    padding: 12px;
`;

export default TripImageManagePage;
