import { useState, useEffect, Fragment, useMemo } from 'react';

import { css } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar, CalendarRange, Trash2 } from 'lucide-react';
import { FaPencilAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

import ImageGroupByDate from '@/domains/media/components/view/ImageGroupByDate';
import MediaImageGrid from '@/domains/media/components/view/MediaImageGrid';
import { IMAGE_MANAGEMENT_TABS } from '@/domains/media/constants';
import { MediaFileMetaData, MediaFileWithDate } from '@/domains/media/types';
import { getImageGroupByDate } from '@/domains/media/utils';
import EditDate from '@/domains/trip/components/EditDate';
import LocationAddMap from '@/domains/trip/components/LocationAddMap';
import { useMediaDelete } from '@/domains/trip/hooks/mutations';
import { mediaAPI } from '@/libs/apis';
import { formatToISOLocal, formatToKorean } from '@/libs/utils/date';
import Button from '@/shared/components/common/Button';
import BackButton from '@/shared/components/common/Button/BackButton';
import Header from '@/shared/components/common/Header';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import TabNavigation from '@/shared/components/common/Tab/TabNavigation';
import { ROUTES } from '@/shared/constants/route';
import { COLORS } from '@/shared/constants/style';
import { useTripImages } from '@/shared/hooks/queries/useImage';
import { useToastStore } from '@/shared/stores/useToastStore';
import theme from '@/shared/styles/theme';
import { Location } from '@/shared/types/map';

const TripImageManagePage = () => {
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState<MediaFileMetaData[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [activeTab, setActiveTab] = useState(IMAGE_MANAGEMENT_TABS[0].id);

    const [isVisibleEditList, setIsVisibleEditList] = useState(false);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [isDateVisible, setIsDateVisible] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { showToast } = useToastStore.getState();

    const { mutate } = useMediaDelete();

    const navigate = useNavigate();
    const { tripKey } = useParams();
    const queryClient = useQueryClient();

    const { data: tripImages = [], isLoading, isError, error } = useTripImages(tripKey!);

    useEffect(() => {
        if (isError) {
            navigate(-1);
            showToast(error.message || '사진을 불러오는데 실패하였습니다.');
        }
    }, [isError, error]);

    useEffect(() => {
        setIsVisibleEditList(false);
    }, [selectedImages.length]);

    useEffect(() => {
        if (!isMapVisible) {
            setSelectedLocation(null);
        }
    }, [selectedLocation, isMapVisible]);

    // const imageGroupByDate = useMemo(() => {
    //     const group = tripImages.reduce<Record<string, MediaFileWithDate>>((acc, curr) => {
    //         const date = curr.recordDate.split('T')[0];

    //         if (!acc[date]) {
    //             acc[date] = { recordDate: date, images: [curr] };
    //         } else {
    //             acc[date].images = [...acc[date].images, curr];
    //         }

    //         return acc;
    //     }, {});

    //     return Object.values(group).sort(
    //         (dateA: MediaFileWithDate, dateB: MediaFileWithDate) =>
    //             new Date(dateA.recordDate).getTime() - new Date(dateB.recordDate).getTime(),
    //     );
    // }, [tripImages]);

    const imageGroupByDate = useMemo(() => getImageGroupByDate(tripImages), [tripImages]);
    console.log(tripImages, imageGroupByDate);
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
                },
                onError: () => {
                    setIsDeleteModalOpen(false);
                    showToast(`사진을 삭제하는데 실패하였습니다.`);
                },
            },
        );
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
            showToast(`${selectedImages.length}의 사진이 수정되었습니다`);
            setSelectedImages([]);
            setIsSelectionMode(false);
            setSelectedDate(null);
        } catch (error) {
            console.error('여행 이미지 삭제 실패', error);
        } finally {
            setIsUploading(false);
        }
    };

    const updateImagesDate = async (selectedImages: MediaFileMetaData[], date: Date | null) => {
        if (!date || !tripKey) return;

        const imagesWithUpdatedDate = selectedImages.map((image) => {
            return {
                ...image,
                recordDate: formatToISOLocal(date),
            };
        });

        try {
            setIsUploading(true);
            await mediaAPI.updateImages(tripKey, imagesWithUpdatedDate);

            setIsDateVisible(false);
            showToast(`${selectedImages.length}장의 사진이 수정되었습니다`);
            setSelectedImages([]);
            setIsSelectionMode(false);
            queryClient.invalidateQueries({ queryKey: ['trip-images'] });
        } catch (error) {
            console.error('여행 이미지 삭제 실패', error);
        } finally {
            setIsUploading(false);
        }
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

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    const isSelectedImage = selectedImages.length > 0;

    if (isLoading) {
        return <Indicator />;
    }

    // return isDateVisible ? (
    //     <EditDate
    //         defaultDate={selectedImages[0].recordDate}
    //         selectedDate={selectedDate}
    //         setSelectedDate={setSelectedDate}
    //         isUploading={isUploading}
    //         uploadImagesWithDate={() => updateImagesDate(selectedImages, selectedDate)}
    //         setIsDateVisible={setIsDateVisible}
    //     />
    // ) : isMapVisible ? (
    //     <LocationAddMap
    //         defaultLocation={{ latitude: tripImages[0].latitude, longitude: tripImages[0].longitude }}
    //         onLocationSelect={handleMapLocationSelect}
    //         setIsMapVisible={setIsMapVisible}
    //         isUploading={isUploading}
    //         uploadImagesWithLocation={() => updateImagesLocation(selectedImages, selectedLocation)}
    //     />
    // ) : (

    {
        /* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {
                <Button
                    text={`위치 없는 사진 관리`}
                    onClick={() => navigate(`/${tripKey}/images/unlocated`)}
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
    }
    return (
        <div css={container}>
            <Header title='사진 관리' isBackButton onBack={() => navigate(ROUTES.PATH.MAIN)}>
                <div>
                    <Button
                        text='선택'
                        customStyle={css`
                            width: 60px;
                            height: 34px;
                            padding: 8px 16px;
                            font-size: 14px;
                            border-radius: 8px;
                        `}
                    />
                    {/* <div
                        css={css`
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        `}
                    >
                        <p
                            css={css`
                                font-size: 14px;
                            `}
                        >
                            0장 선택
                        </p>
                        <Button
                            variant='white'
                            text='취소'
                            customStyle={css`
                                width: 60px;
                                height: 34px;
                                padding: 8px 16px;
                                font-size: 14px;
                                border-radius: 8px;
                            `}
                        />
                    </div> */}
                </div>
            </Header>
            <TabNavigation tabs={IMAGE_MANAGEMENT_TABS} activeTab={activeTab} onActiveChange={handleTabChange} />

            <main css={mainStyle}>
                {imageGroupByDate?.map((imageGroup) => (
                    <ImageGroupByDate
                        key={imageGroup.recordDate}
                        imageGroup={imageGroup}
                        selectedImages={selectedImages}
                        onImageClick={() => (isSelectionMode ? handleImageToggle : null)}
                    />
                ))}
            </main>

            {/* <div>
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
                    <div css={buttonContainer}>
                        <Button text='사진 선택' variant='white' onClick={() => setIsSelectionMode(true)} />
                        <Button
                            text='새로운 사진 등록하기'
                            onClick={() => navigate(`${ROUTES.PATH.TRIP.NEW(tripKey!)}?edit`)}
                        />
                    </div>
                )}
            </div> */}

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
