import { useState, useEffect, Fragment } from 'react';

import { css } from '@emotion/react';
import { BellOff, Trash2 } from 'lucide-react';
import { FaPencilAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

import MediaImageGrid from '@/domains/media/components/view/MediaImageGrid';
import { MediaFileMetaData } from '@/domains/media/types';
import LocationAddMap from '@/domains/trip/components/LocationAddMap';
import { useMediaDelete } from '@/domains/trip/hooks/mutations';
import { mediaAPI } from '@/libs/apis';
import { formatToKorean } from '@/libs/utils/date';
import Button from '@/shared/components/common/Button';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import Spinner from '@/shared/components/common/Spinner/Indicator';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Location } from '@/shared/types/map';

interface Media {
    mediaFileId: number;
    mediaLink: string;
}

interface UnlocatedMediaGroup {
    recordDate: string;
    media: Media[];
}

interface ApiResponse {
    status: number;
    code: number;
    message: string;
    data: UnlocatedMediaGroup[];
    httpStatus: string;
}

const UnlocatedImagePage = () => {
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [unlocatedImageGroups, setUnlocatedImageGroups] = useState<UnlocatedMediaGroup[]>([]);
    const [selectedImages, setSelectedImages] = useState<MediaFileMetaData[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isVisibleEditList, setIsVisibleEditList] = useState(false);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { showToast } = useToastStore.getState();

    const { mutate } = useMediaDelete();

    const navigate = useNavigate();
    const { tripKey } = useParams();

    useEffect(() => {
        const getImages = async () => {
            try {
                setIsLoading(true);
                const response = await mediaAPI.getUnlcoatedImages(tripKey!);
                if (response) {
                    setUnlocatedImageGroups(response);
                }
            } catch (error) {
                console.error('위치 정보 없는 이미지 불러오기 실패', error);
                showToast('이미지를 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        if (tripKey) {
            getImages();
        }
    }, [tripKey, showToast]);

    useEffect(() => {
        setIsVisibleEditList(false);
    }, [selectedImages.length]);

    useEffect(() => {
        if (!isMapVisible) {
            setSelectedLocation(null);
        }
    }, [isMapVisible]);

    // MediaFileMetaData 형식으로 변환
    const convertToMediaFileMetaData = (media: Media, recordDate: string): MediaFileMetaData => {
        return {
            mediaFileId: String(media.mediaFileId),
            mediaLink: media.mediaLink,
            recordDate,
            latitude: 0, // 기본값
            longitude: 0, // 기본값
        };
    };

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

    const deleteImages = (selectedImages: MediaFileMetaData[]) => {
        if (!tripKey) return;
        mutate(
            {
                tripKey,
                images: selectedImages.map((image) => image.mediaFileId),
            },
            {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedImages([]);
                    setIsSelectionMode(false);

                    // API 재호출
                    getUnlocatedImages();
                },
                onError: () => {
                    setIsDeleteModalOpen(false);
                    showToast(`사진을 삭제하는데 실패하였습니다.`);
                },
            },
        );
    };

    const getUnlocatedImages = async () => {
        try {
            const response: ApiResponse = await mediaAPI.getUnlcoatedImages(tripKey!);
            if (response && response.data) {
                setUnlocatedImageGroups(response.data);
            }
        } catch (error) {
            console.error('위치 정보 없는 이미지 불러오기 실패', error);
        }
    };

    const updateImagesLocation = async (selectedImages: MediaFileMetaData[], location: Location | null) => {
        if (!location || !tripKey) return;

        const imagesWithUpdatedLocation = selectedImages.map((image) => {
            return {
                ...image,
                latitude: location.latitude,
                longitude: location.longitude,
            };
        });

        try {
            setIsUploading(true);
            await mediaAPI.updateImages(tripKey, imagesWithUpdatedLocation);

            setIsMapVisible(false);
            showToast(`${selectedImages.length}장의 사진이 수정되었습니다`);
            setSelectedImages([]);
            setIsSelectionMode(false);

            // 업데이트 후 데이터 다시 불러오기
            getUnlocatedImages();
        } catch (error) {
            console.error('여행 이미지 위치 수정 실패', error);
            showToast('이미지 위치 수정에 실패했습니다');
        } finally {
            setIsUploading(false);
        }
    };

    const isSelectedImage = selectedImages.length > 0;

    if (isLoading) {
        return <Spinner />;
    }

    const defaultLocation = { latitude: 37.5665, longitude: 126.978 };

    return isMapVisible ? (
        <LocationAddMap
            defaultLocation={defaultLocation}
            onLocationSelect={handleMapLocationSelect}
            setIsMapVisible={setIsMapVisible}
            isUploading={isUploading}
            uploadImagesWithLocation={() => updateImagesLocation(selectedImages, selectedLocation)}
        />
    ) : (
        <div css={container}>
            <Header title='사진 관리' isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)} />
            <main css={mainStyle}>
                {unlocatedImageGroups.map((group) => (
                    <Fragment key={group.recordDate}>
                        <h2 css={dateStyle}>{formatToKorean(group.recordDate)}</h2>
                        <MediaImageGrid
                            images={group.media.map((media) => convertToMediaFileMetaData(media, group.recordDate))}
                            selectedImages={selectedImages}
                            onImageClick={isSelectionMode ? handleImageToggle : () => null}
                        />
                    </Fragment>
                ))}

                {unlocatedImageGroups.length === 0 && (
                    // <div
                    //     css={css`
                    //         display: flex;
                    //         flex-direction: column;
                    //         align-items: center;
                    //         justify-content: center;
                    //         height: 50vh;
                    //         text-align: center;
                    //         color: ${COLORS.TEXT.DESCRIPTION};
                    //     `}
                    // >
                    //     <p>위치 정보가 없는 사진이 없습니다.</p>
                    // </div>
                    <div css={emptyNotification}>
                        <div css={belloffIcon}>
                            <BellOff color='white' />
                        </div>
                        <h3 css={emptyNotificationHeading}>새로운 알림이 없습니다</h3>
                        <p css={emptyNotificationDescription}>위치 정보가 없는 사진이 없습니다</p>
                    </div>
                )}
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
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <Button text='사진 선택' variant='white' onClick={() => setIsSelectionMode(true)} />
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

const emptyNotification = css`
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const emptyNotificationHeading = css`
    margin-top: 18px;
    color: #303038;
    font-size: 18px;
    font-weight: bold;
`;

const emptyNotificationDescription = css`
    margin-top: 8px;
    color: #767678;
    font-size: 15px;
    line-height: 21px;
    text-align: center;
    white-space: pre-line;
`;

const belloffIcon = css`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.TEXT.DESCRIPTION_LIGHT};
`;

export default UnlocatedImagePage;
