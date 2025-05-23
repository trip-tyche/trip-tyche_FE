import { useState, useEffect, useMemo } from 'react';

import { css } from '@emotion/react';
import { ImageOff, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import ImageGroupByDate from '@/domains/media/components/view/ImageGroupByDate';
import { IMAGE_MANAGEMENT_TABS, MediaFileCategoryKey } from '@/domains/media/constants';
import { useMediaDelete, useMetadataUpdate } from '@/domains/media/hooks/mutations';
import { useTripImages } from '@/domains/media/hooks/queries';
import { MediaFile, MediaFileCategories } from '@/domains/media/types';
import {
    filterValidMediaFile,
    filterWithoutDateMediaFile,
    filterWithoutLocationMediaFile,
    getImageGroupByDate,
} from '@/domains/media/utils';
import EditDate from '@/domains/trip/components/EditDate';
import LocationAddMap from '@/domains/trip/components/LocationAddMap';
import { formatToISOLocal } from '@/libs/utils/date';
import Button from '@/shared/components/common/Button';
import EmptyItem from '@/shared/components/common/EmptyItem';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import TabNavigation from '@/shared/components/common/Tab/TabNavigation';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import { EMPTY_ITEM } from '@/shared/constants/ui';
import { useImageSelection } from '@/shared/hooks/useImageSelection';
import { useMapScript } from '@/shared/hooks/useMapScript';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Location } from '@/shared/types/map';

const TripImageManagePage = () => {
    const [activeTab, setActiveTab] = useState(IMAGE_MANAGEMENT_TABS[0].id);
    const [imageCategories, setImageCategories] = useState<MediaFileCategories>();

    const [updatedLocation, setUpdatedLocation] = useState<Location | null>(null);
    const [updatedDate, setUpdatedDate] = useState<Date | null>(null);

    const [isLocationEditing, setIsLocationEditing] = useState(false);
    const [isDateEditing, setIsDateEditing] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { isMapScriptLoaded } = useMapScript();
    const { showToast } = useToastStore();
    const {
        selectedImages,
        isSelectionMode,
        handlers: { toggleImage, onSelectionMode, offSelectionMode },
    } = useImageSelection();

    const { tripKey } = useParams();
    const navigate = useNavigate();
    // const queryClient = useQueryClient();
    const { mutate: deleteImagesMutate, isPending: isImageDeleting } = useMediaDelete();
    const { mutate: updateImageMetadataMutate, isPending: isImageUpdating } = useMetadataUpdate();

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
        offSelectionMode();
    }, [activeTab]);

    useEffect(() => {
        if (!isLocationEditing) {
            setUpdatedLocation(null);
        }
    }, [updatedLocation, isLocationEditing]);

    const imageGroupsByDate = useMemo(() => {
        if (imageCategories && imageCategories[activeTab]) {
            const imagesByActive = imageCategories[activeTab].images || [];
            return getImageGroupByDate(imagesByActive);
        }
    }, [imageCategories, activeTab]);

    const deleteImages = (images: MediaFile[]) => {
        setIsDeleteModalOpen(false);
        deleteImagesMutate(
            { tripKey: tripKey!, images },
            {
                onSuccess: (result) => {
                    if (!result.success) {
                        showToast(result.error);
                    }
                    offSelectionMode();
                },
            },
        );
    };

    const updateImages = async (images: MediaFile[], location: Location | null, date: Date | null) => {
        const updatedImages = images.map((image) => {
            return {
                ...image,
                latitude: location ? location.latitude : image.latitude,
                longitude: location ? location.longitude : image.longitude,
                recordDate: date ? formatToISOLocal(date) : image.recordDate,
            };
        });

        updateImageMetadataMutate(
            { tripKey: tripKey!, images: updatedImages },
            {
                onSuccess: (result) => {
                    showToast(result.success ? `${selectedImages.length} 장의 사진이 수정되었습니다` : result.error);
                },
            },
        );
        setIsLocationEditing(false);
        setIsDateEditing(false);
        offSelectionMode();
        setUpdatedDate(null);
        setUpdatedLocation(null);
    };

    const handleMapLocationSelect = (latitude: number, longitude: number) => {
        setUpdatedLocation({ latitude, longitude });
    };

    const isSelectedImage = selectedImages.length > 0;

    const renderEditMode = () => {
        return (
            <div css={editContainer}>
                {isLocationEditing && (
                    <LocationAddMap
                        defaultLocation={{
                            latitude: selectedImages[0].latitude,
                            longitude: selectedImages[0].longitude,
                        }}
                        onLocationSelect={handleMapLocationSelect}
                        setIsMapVisible={setIsLocationEditing}
                        isUploading={isUploading}
                        uploadImagesWithLocation={() => updateImages(selectedImages, updatedLocation, null)}
                    />
                )}

                {/* {isDateEditing && (
                    <EditDate
                        defaultDate={selectedImages[0].recordDate}
                        updatedDate={updatedDate}
                        setUpdatedDate={setUpdatedDate}
                        isUploading={isUploading}
                        uploadImagesWithDate={() => null}
                        // uploadImagesWithDate={() => updateImagesDate(selectedImages, updatedDate)}
                        setIsDateEditing={setIsDateEditing}
                    />
                )} */}
            </div>
        );
    };

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

    const hasImages = imageGroupsByDate && imageGroupsByDate?.length > 0;

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
                                onClick={offSelectionMode}
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
                            onClick={onSelectionMode}
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
            <TabNavigation
                tabs={IMAGE_MANAGEMENT_TABS}
                activeTab={activeTab}
                onActiveChange={(activeTab) => setActiveTab(activeTab as MediaFileCategoryKey)}
            />
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
                    {imageGroupsByDate?.map((imageGroup) => (
                        <ImageGroupByDate
                            key={imageGroup.recordDate}
                            imageGroup={imageGroup}
                            selectedImages={selectedImages}
                            onImageClick={(image) => {
                                isSelectionMode ? toggleImage(image) : null;
                            }}
                        />
                    ))}
                </main>
            ) : (
                <EmptyItem
                    title={EMPTY_ITEM.IMAGE(activeTab)?.title || ''}
                    description={EMPTY_ITEM.IMAGE(activeTab)?.description || ''}
                    icon={<ImageOff />}
                />
            )}

            {isSelectedImage && (
                <div css={buttonContainer}>
                    <Button text='위치 수정' variant='white' onClick={() => setIsLocationEditing(true)} />
                    <Button text='날짜 수정' variant='white' />
                    <Button variant='error' text='삭제' onClick={() => setIsDeleteModalOpen(true)} />
                </div>
            )}

            {(isLocationEditing || isDateEditing) && renderEditMode()}

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

const editContainer = css`
    width: 100%;
    height: 100dvh;
    position: absolute;
    inset: 0;
    z-index: 9999;
`;

export default TripImageManagePage;
