import { useState, useEffect, useMemo } from 'react';

import { css } from '@emotion/react';
import { ImageOff, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import ImageGroupByDate from '@/domains/media/components/view/ImageGroupByDate';
import { IMAGE_MANAGEMENT_TABS, MediaFileCategoryKey } from '@/domains/media/constants';
import { useMediaDelete } from '@/domains/media/hooks/mutations';
import { MediaFile, MediaFileCategories } from '@/domains/media/types';
import {
    filterValidMediaFile,
    filterWithoutDateMediaFile,
    filterWithoutLocationMediaFile,
    getImageGroupByDate,
} from '@/domains/media/utils';
import LocationAddMap from '@/domains/trip/components/LocationAddMap';
import { mediaAPI } from '@/libs/apis';
import Button from '@/shared/components/common/Button';
import EmptyItem from '@/shared/components/common/EmptyItem';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import TabNavigation from '@/shared/components/common/Tab/TabNavigation';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import { useTripImages } from '@/shared/hooks/queries/useImage';
import { useMapScript } from '@/shared/hooks/useMapScript';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Location } from '@/shared/types/map';

const TripImageManagePage = () => {
    const [activeTab, setActiveTab] = useState(IMAGE_MANAGEMENT_TABS[0].id);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [imageCategories, setImageCategories] = useState<MediaFileCategories>();
    const [selectedImages, setSelectedImages] = useState<MediaFile[]>([]);
    const [updatedLocation, setUpdatedLocation] = useState<Location | null>(null);
    const [updatedDate, setUpdatedDate] = useState<Date | null>(null);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [isDateVisible, setIsDateVisible] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { isMapScriptLoaded } = useMapScript();
    const { showToast } = useToastStore.getState();

    const { tripKey } = useParams();
    const navigate = useNavigate();
    // const queryClient = useQueryClient();
    const { mutate, isPending: isImageDeleting } = useMediaDelete();
    const { data: result, isLoading } = useTripImages(tripKey!);

    useEffect(() => {
        if (!result) return;

        if (!result.success) {
            showToast(result.error);
            return;
        } else {
            const images = result.data;

            setImageCategories({
                withAll: { count: images.length || 0, images: (filterValidMediaFile(images) as MediaFile[]) || [] },
                withoutLocation: {
                    count: filterWithoutLocationMediaFile(images).length || 0,
                    images: (filterWithoutLocationMediaFile(images) as MediaFile[]) || [],
                },
                withoutDate: {
                    count: filterWithoutDateMediaFile(images).length || 0,
                    images: (filterWithoutDateMediaFile(images) as MediaFile[]) || [],
                },
            });
        }
    }, [result]);

    useEffect(() => {
        setIsSelectionMode(false);
    }, [activeTab]);

    useEffect(() => {
        if (!isSelectionMode) {
            setSelectedImages([]);
        }
    }, [isSelectionMode]);

    useEffect(() => {
        if (!isMapVisible) {
            setUpdatedLocation(null);
        }
    }, [updatedLocation, isMapVisible]);

    const imageGroupByDate = useMemo(() => {
        if (!imageCategories) return;
        const activeImage = imageCategories[activeTab];
        if (!activeImage.images) return;
        return getImageGroupByDate(activeImage.images);
    }, [imageCategories, activeTab]);

    const deleteImages = (selectedImages: MediaFile[]) => {
        setIsDeleteModalOpen(false);
        mutate(
            {
                tripKey: tripKey!,
                images: selectedImages.map((image) => image.mediaFileId!),
            },
            {
                onSuccess: () => {
                    setSelectedImages([]);
                    setIsSelectionMode(false);
                },
                // onError: () => {
                //     setIsDeleteModalOpen(false);
                //     showToast(`사진을 삭제하는데 실패하였습니다`);
                // },
            },
        );
    };

    const updateImagesLocation = async (selectedImages: MediaFile[], location: Location | null) => {
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
            showToast(`${selectedImages.length}의 사진이 수정되었습니다`);
            setSelectedImages([]);
            setIsSelectionMode(false);
            setUpdatedDate(null);
        } catch (error) {
            console.error('여행 이미지 삭제 실패', error);
        } finally {
            setIsUploading(false);
        }
    };

    // const updateImagesDate = async (selectedImages: MediaFile[], date: Date | null) => {
    //     if (!date || !tripKey) return;

    //     const imagesWithUpdatedDate = selectedImages.map((image) => {
    //         return {
    //             ...image,
    //             recordDate: formatToISOLocal(date),
    //         };
    //     });

    //     try {
    //         setIsUploading(true);
    //         await mediaAPI.updateImages(tripKey, imagesWithUpdatedDate);

    //         setIsDateVisible(false);
    //         showToast(`${selectedImages.length}장의 사진이 수정되었습니다`);
    //         setSelectedImages([]);
    //         setIsSelectionMode(false);
    //         queryClient.invalidateQueries({ queryKey: ['trip-images'] });
    //     } catch (error) {
    //         console.error('여행 이미지 삭제 실패', error);
    //     } finally {
    //         setIsUploading(false);
    //     }
    // };
    const handleImageToggle = (selectedImage: MediaFile) => {
        const isAlreadySelected = selectedImages.some((image) => image.mediaFileId === selectedImage.mediaFileId);
        if (isAlreadySelected) {
            setSelectedImages(selectedImages.filter((image) => image.mediaFileId !== selectedImage.mediaFileId));
        } else {
            setSelectedImages((prev) => [...prev, selectedImage]);
        }
    };

    const handleMapLocationSelect = (latitude: number, longitude: number) => {
        setUpdatedLocation({ latitude, longitude });
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId as MediaFileCategoryKey);
    };
    const isSelectedImage = selectedImages.length > 0;

    const renderEmptyImage = (tabId: string) => {
        switch (tabId) {
            case 'withAll':
                return {
                    title: '등록된 사진이 없어요',
                    description: '티켓 속 사진 관리에서\n새로운 사진을 등록해주세요',
                };
            case 'withoutLocation':
                return {
                    title: '위치 정보가 없는 사진이 없어요',
                    description: '모든 사진에 위치 정보가 포함되어 있습니다',
                };
            case 'withoutDate':
                return {
                    title: '날짜 정보가 없는 사진이 없어요',
                    description: '모든 사진에 촬영 날짜가 포함되어 있습니다',
                };
            default:
                return {
                    title: '등록된 사진이 없어요',
                    description: '티켓 속 사진 관리에서\n새로운 사진을 등록해주세요',
                };
        }
    };

    const renderMap = () => {
        if (isMapVisible) {
            return (
                <LocationAddMap
                    defaultLocation={{ latitude: selectedImages[0].latitude, longitude: selectedImages[0].longitude }}
                    onLocationSelect={handleMapLocationSelect}
                    setIsMapVisible={setIsMapVisible}
                    isUploading={isUploading}
                    uploadImagesWithLocation={() => updateImagesLocation(selectedImages, updatedLocation)}
                />
            );
        }
    };

    // return isDateVisible ? (
    //     <EditDate
    //         defaultDate={selectedImages[0].recordDate}
    //         updatedDate={updatedDate}
    //         setUpdatedDate={setUpdatedDate}
    //         isUploading={isUploading}
    //         uploadImagesWithDate={() => updateImagesDate(selectedImages, updatedDate)}
    //         setIsDateVisible={setIsDateVisible}
    //     />

    /* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {
                <Button
                    text={`위치 없는 사진 관리`}
                    onClick={() => navigate(`/${tripKey}/imageCategories/unlocated`)}
                    css={css`
                        width: auto;
                        height: 34px;
                        padding: 0 24px;
                        margin: 12px 12px 0 0;
                        border-radius: 12px;
                        font-size: ${theme.FONT_SIZES.SM};
                        `}
                        />
                        }
                        </div> */

    const hasImages = imageGroupByDate && imageGroupByDate?.length > 0;
    console.log('sesle', selectedImages);
    return (
        <div css={container}>
            {isMapScriptLoaded && isLoading && <Indicator text='사진 불러오는 중...' />}
            {isImageDeleting && <Indicator text='사진 삭제 중...' />}

            <Header title='사진 관리' isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)}>
                <div>
                    {isSelectionMode ? (
                        <div
                            css={css`
                                display: flex;
                                align-items: center;
                                gap: 12px;
                            `}
                        >
                            <p
                                css={css`
                                    font-size: 14px;
                                    font-weight: 500;
                                    color: #6b7280;
                                `}
                            >
                                {selectedImages.length}장 선택
                            </p>
                            <Button
                                variant='white'
                                text='취소'
                                onClick={() => setIsSelectionMode(false)}
                                customStyle={css`
                                    width: 60px;
                                    height: 34px;
                                    padding: 8px 16px;
                                    font-size: 14px;
                                    border-radius: 8px;
                                `}
                            />
                        </div>
                    ) : (
                        <Button
                            text='선택'
                            onClick={() => setIsSelectionMode(true)}
                            customStyle={css`
                                width: 60px;
                                height: 34px;
                                padding: 8px 16px;
                                font-size: 14px;
                                border-radius: 8px;
                            `}
                        />
                    )}
                </div>
            </Header>
            <TabNavigation tabs={IMAGE_MANAGEMENT_TABS} activeTab={activeTab} onActiveChange={handleTabChange} />
            <div
                css={css`
                    padding: 12px 16px;
                    display: flex;
                    justify-content: end;
                `}
            >
                <Button
                    variant='white'
                    text='새로운 사진 추가'
                    icon={<Plus size={20} />}
                    onClick={() => {}}
                    customStyle={css`
                        width: 160px;
                        height: 38px;
                        padding: 8px 16px;
                        font-size: 14px;
                        border-radius: 8px;
                    `}
                />
            </div>

            {/* 이미지 그리드 */}
            {hasImages ? (
                <main css={mainStyle}>
                    {imageGroupByDate?.map((imageGroup) => (
                        <ImageGroupByDate
                            key={imageGroup.recordDate}
                            imageGroup={imageGroup}
                            selectedImages={selectedImages}
                            onImageClick={(image) => {
                                isSelectionMode ? handleImageToggle(image) : null;
                            }}
                        />
                    ))}
                </main>
            ) : (
                <EmptyItem
                    title={renderEmptyImage(activeTab)?.title || ''}
                    description={renderEmptyImage(activeTab)?.description || ''}
                    icon={<ImageOff />}
                />
            )}

            {isSelectedImage && (
                <div css={buttonContainer}>
                    <Button text='위치 수정' variant='white' onClick={() => setIsMapVisible(true)} />
                    <Button text='날짜 수정' variant='white' />
                    <Button variant='error' text='삭제' onClick={() => setIsDeleteModalOpen(true)} />
                </div>
            )}

            {renderMap()}
            {isDeleteModalOpen && (
                <ConfirmModal
                    title={`${selectedImages.length}장의 사진 삭제`}
                    description={`삭제한 여행 사진은 다시 복구할 수 없습니다.\n그래도 삭제하시겠습니까?`}
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
    position: relative;
`;

const mainStyle = css`
    flex: 1;
    padding: 0 12px 12px 12px;
    display: flex;
    flex-direction: column;
    background-color: ${COLORS.BACKGROUND.WHITE_SECONDARY};
    overflow: auto;
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
    font-weight: 700;
    /* padding: 12px; */
`;

const buttonContainer = css`
    width: 100%;
    padding: 12px;
    display: flex;
    gap: 12px;
    background-color: ${COLORS.BACKGROUND.WHITE};
`;
export default TripImageManagePage;
