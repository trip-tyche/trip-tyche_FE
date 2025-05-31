import { useState, useEffect, useMemo, useCallback } from 'react';

import { css } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
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
import { formatToISOLocal } from '@/libs/utils/date';
import Button from '@/shared/components/common/Button';
import EmptyItem from '@/shared/components/common/EmptyItem';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import TabNavigation from '@/shared/components/common/Tab/TabNavigation';
import TripImageUploadPageS from '@/shared/components/common/TripImageUploadPageS';
import SearchPlaceInput from '@/shared/components/map/SearchPlaceInput';
import SingleMarkerMap from '@/shared/components/map/SingleMarkerMap';
import { DEFAULT_CENTER, ZOOM_SCALE } from '@/shared/constants/map';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import { EMPTY_ITEM } from '@/shared/constants/ui';
import { useImageSelection } from '@/shared/hooks/useImageSelection';
import { useMapControl } from '@/shared/hooks/useMapControl';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Location, MapMouseEvent } from '@/shared/types/map';

const TripImageManagePage = () => {
    const [activeTab, setActiveTab] = useState(IMAGE_MANAGEMENT_TABS[0].id);
    const [imageCategories, setImageCategories] = useState<MediaFileCategories>();

    const [updatedLocation, setUpdatedLocation] = useState<Location | null>(null);
    const [updatedDate, setUpdatedDate] = useState<Date | null>(null);

    const [isLocationEditing, setIsLocationEditing] = useState(false);
    const [isDateEditing, setIsDateEditing] = useState(false);

    const [isNewImage, setIsNewImage] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const handlePageLoaded = useCallback(() => {
        setIsPageLoading(false);
    }, []);

    const { showToast } = useToastStore();
    const {
        selectedImages,
        isSelectionMode,
        handlers: { toggleImage, onSelectionMode, offSelectionMode },
    } = useImageSelection();

    const { mapRef, isMapScriptLoaded, updateMapCenter } = useMapControl(ZOOM_SCALE.DEFAULT, DEFAULT_CENTER);

    const { tripKey } = useParams();
    const navigate = useNavigate();
    const { mutate: deleteImagesMutate, isPending: isImageDeleting } = useMediaDelete();
    const { mutate: updateImageMetadataMutate, isPending: isImageUpdating } = useMetadataUpdate();

    const { data: result, isLoading } = useTripImages(tripKey!);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!result) return;
        if (!result.success) {
            showToast(result.error);
            return;
        } else {
            const images = result.data;
            console.log('zxcvzxcvxcv', filterWithoutDateMediaFile(images).length);
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
                    showToast(result.success ? result.data : result.error);
                },
            },
        );
        offSelectionMode();
    };

    const updateImages = async (location: Location | null, date: Date | null) => {
        const updatedImages = selectedImages.map((image) => {
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
                    showToast(result.success ? `${selectedImages.length}장의 사진이 수정되었습니다` : result.error);
                    setIsLocationEditing(false);
                    setIsDateEditing(false);
                    offSelectionMode();
                    setUpdatedDate(null);
                    setUpdatedLocation(null);
                    queryClient.invalidateQueries({ queryKey: ['route', tripKey] });
                },
            },
        );
    };

    const handleMapLocationSelect = (latitude: number, longitude: number) => {
        updateMapCenter({ latitude, longitude });
        setUpdatedLocation({ latitude, longitude });
    };

    const handleMapClick = (event: MapMouseEvent | undefined) => {
        if (event && event.latLng) {
            const newLocation = {
                latitude: event.latLng.lat(),
                longitude: event.latLng.lng(),
            };

            setUpdatedLocation(newLocation);
        }
    };

    const isSelectedImage = selectedImages.length > 0;
    const defaultLocation = updatedLocation
        ? updatedLocation
        : selectedImages[0]
          ? { latitude: selectedImages[0].latitude, longitude: selectedImages[0].longitude }
          : null;

    const renderEditMode = () => {
        return (
            <div css={editContainer}>
                {isNewImage && <TripImageUploadPageS onClose={() => setIsNewImage(false)} />}

                {isLocationEditing && (
                    <>
                        <SearchPlaceInput
                            isMapScriptLoaded={isMapScriptLoaded}
                            isBackButtonDisable={isImageUpdating}
                            onLocationChange={handleMapLocationSelect}
                            onBack={() => setIsLocationEditing(false)}
                        />
                        <SingleMarkerMap
                            mapRef={mapRef}
                            position={defaultLocation}
                            onMapClick={handleMapClick}
                            mapHeight='100dvh'
                        />
                        <div
                            css={css`
                                width: 100%;
                                position: absolute;
                                bottom: 0;
                                padding: 16px;
                                z-index: 999;
                                background-color: ${COLORS.BACKGROUND.WHITE};
                            `}
                        >
                            <Button
                                text='위치 등록하기'
                                onClick={() => updateImages(updatedLocation, null)}
                                disabled={!updatedLocation}
                                isLoading={isImageUpdating}
                                loadingText='위치 등록중...'
                            ></Button>
                        </div>
                    </>
                )}

                {isDateEditing && (
                    <EditDate
                        defaultDate={selectedImages[0].recordDate}
                        updatedDate={updatedDate}
                        setUpdatedDate={setUpdatedDate}
                        isUploading={isImageUpdating}
                        uploadImagesWithDate={() => updateImages(null, updatedDate)}
                        setIsDateEditing={setIsDateEditing}
                    />
                )}
            </div>
        );
    };

    const isImageAndAddressLoading = imageGroupsByDate && imageGroupsByDate?.length > 0 ? isPageLoading : false;

    return (
        <div css={container}>
            {(!isMapScriptLoaded || isLoading || isImageAndAddressLoading) && <Indicator />}
            {isImageDeleting && <Indicator text='사진 삭제 중...' />}
            {isImageUpdating && <Indicator text='사진 수정 중...' />}

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
                    onClick={() => setIsNewImage(true)}
                    customStyle={css`
                        width: 160px;
                        height: 38px;
                        padding: 8px 16px;
                        font-size: 14px;
                        border-radius: 8px;
                    `}
                />
            </div>

            {imageGroupsByDate &&
                (imageGroupsByDate.length > 0 ? (
                    <main css={mainStyle(isPageLoading || !imageGroupsByDate)}>
                        {imageGroupsByDate?.map((imageGroup) => (
                            <ImageGroupByDate
                                key={imageGroup.recordDate}
                                imageGroup={imageGroup}
                                selectedImages={selectedImages}
                                onImageClick={(image) => {
                                    isSelectionMode ? toggleImage(image) : null;
                                }}
                                onLoad={handlePageLoaded}
                            />
                        ))}
                    </main>
                ) : (
                    <EmptyItem
                        title={EMPTY_ITEM.IMAGE(activeTab)?.title || ''}
                        description={EMPTY_ITEM.IMAGE(activeTab)?.description || ''}
                        icon={<ImageOff />}
                    />
                ))}

            {isSelectedImage && (
                <div css={buttonContainer}>
                    {activeTab !== 'withoutDate' && (
                        <Button text='위치 수정' variant='white' onClick={() => setIsLocationEditing(true)} />
                    )}
                    {activeTab !== 'withoutLocation' && (
                        <Button text='날짜 수정' variant='white' onClick={() => setIsDateEditing(true)} />
                    )}
                    <Button variant='error' text='삭제' onClick={() => setIsDeleteModalOpen(true)} />
                </div>
            )}

            {(isLocationEditing || isDateEditing || isNewImage) && renderEditMode()}

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

const mainStyle = (isLoading: boolean) => css`
    flex: 1;
    padding: 0 12px 12px 12px;
    display: ${isLoading ? 'none' : 'flex'};
    flex-direction: column;
    background-color: ${COLORS.BACKGROUND.WHITE_SECONDARY};
    overflow: auto;
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
    z-index: 995;
`;

export default TripImageManagePage;
