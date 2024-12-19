import { useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import { ROUTES } from '@/constants/paths';
import { useToastStore } from '@/stores/useToastStore';
import { Location } from '@/types/location';
import { UnlocatedMediaFile, UnlocatedMediaFileModel } from '@/types/media';

export const useLocationAdd = () => {
    // const [displayedImages, setDisplayedImages] = useState<ImageModel[]>([]);
    const [displayedImages, setDisplayedImages] = useState<UnlocatedMediaFileModel[]>([]);
    // const [defaultLocation, setDisplayedImages] = useState<UnlocatedMediaFileModel[]>([]);
    // const [selectedImages, setSelectedImages] = useState<ImageModel[]>([]);
    const [selectedImages, setSelectedImages] = useState<UnlocatedMediaFile[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location>(null);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();
    const { tripId } = useParams();

    // const { data: defaultLocation } = useTripDefaultLocation(tripId as string);

    useEffect(() => {
        getUnlocatedImagesData();
    }, []);

    const getUnlocatedImagesData = async () => {
        if (!tripId) {
            return;
        }

        const unlocatedImages = await tripImageAPI.fetchUnlocatedImages(tripId);
        if (!unlocatedImages) {
            navigate(`${ROUTES.PATH.TRIPS.ROOT}`);
            return;
        }
        // const defaultLocation = await tripImageAPI.fetchDefaultLocation(tripId);
        setDisplayedImages(unlocatedImages);
    };

    // 그리드: 사진 토글 함수
    const handleHashtagSelect = (image: UnlocatedMediaFile) => {
        setSelectedImages((selectedImages) => {
            const isSelected = selectedImages.some((selectedImage) => selectedImage.mediaFileId === image.mediaFileId);

            if (isSelected) {
                return selectedImages.filter((selectedImage) => selectedImage.mediaFileId !== image.mediaFileId);
            } else {
                return [...selectedImages, image];
            }
        });
    };

    // 지도: 위치 선택 함수
    const handleMapLocationSelect = (latitude: number, longitude: number) => {
        setSelectedLocation({ latitude, longitude });
    };

    // 이미지 업데이트
    // const updateDisplayedImages = () => {
    //     const updatedDisplayedImages = displayedImages.media.filter((displayedImage) => {
    //         const isSelected = selectedImages.some(
    //             (selectedImage) => selectedImage.mediaFileId === displayedImage.image.name,
    //         );
    //         return !isSelected;
    //     });

    //     if (updatedDisplayedImages.length === 0) {
    //         // if (isTripInfoEditing) {
    //         //     navigate(`${ROUTES.PATH.TRIPS.ROOT}`);
    //         //     setIsEditing(false);
    //         // } else {
    //         navigate(`${ROUTES.PATH.TRIPS.NEW.INFO(Number(tripId))}`);
    //         // return;
    //         // }
    //     }
    // };

    //     setDisplayedImages(updatedDisplayedImages);
    //     setSelectedImages([]);
    //     setSelectedLocation(null);
    //     setIsMapVisible(false);
    // };

    // 이미지 업로드
    // const uploadImages = async (images: ImageModel[]) => {
    //     try {
    //         if (!tripId) {
    //             return;
    //         }

    //         if (isTripInfoEditing) {
    //             await updateTripDate(
    //                 tripId,
    //                 images.map((image) => image.formattedDate),
    //             );
    //         }

    //         const imagesToUpload = images.map((image) => image.image);

    //         setIsUploading(true);
    //         await tripImageAPI.createTripImages(tripId, imagesToUpload);
    //     } catch (error) {
    //         showToast('다시 로그인해주세요.');
    //         navigate(ROUTES.PATH.AUTH.LOGIN);
    //     } finally {
    //         setIsUploading(false);
    //     }
    // };

    // 지도: 메타데이터 업데이트 및 이미지 업로드
    // const uploadImagesWithLocation = async () => {
    //     if (!selectedLocation) {
    //         return;
    //     }

    //     setIsUploading(true);
    //     const uploadPromise = selectedImages.map((image) =>
    //         tripImageAPI.updateUnlocatedImages(tripId as string, String(image.mediaFileId), selectedLocation),
    //     );
    //     Promise.allSettled(uploadPromise);
    //     setIsUploading(false);

    //     showToast('위치가 등록되었습니다');
    //     setSelectedImages([]);
    //     setSelectedLocation(null);
    //     setIsMapVisible(false);
    // };
    const uploadImagesWithLocation = async () => {
        if (!selectedLocation) {
            return;
        }
        console.log(selectedLocation, selectedImages);
        setIsUploading(true);
        try {
            const uploadPromise = selectedImages.map((image) =>
                tripImageAPI.updateUnlocatedImages(tripId as string, String(image.mediaFileId), selectedLocation),
            );
            await Promise.allSettled(uploadPromise);

            await getUnlocatedImagesData();
            showToast('위치가 등록되었습니다');
        } catch (error) {
            showToast('위치 등록에 실패했습니다');
        } finally {
            setIsUploading(false);
            setSelectedImages([]);
            setSelectedLocation(null);
            setIsMapVisible(false);
        }
    };

    const imageGroupByDate = useMemo(() => {
        const grouped = displayedImages.reduce<Record<string, UnlocatedMediaFileModel>>((acc, curr) => {
            const date = curr.recordDate.split('T')[0];
            if (!acc[date]) {
                acc[date] = { recordDate: date, media: [...curr.media] };
            } else {
                acc[date].media = [...acc[date].media, ...curr.media];
            }
            return acc;
        }, {});

        return Object.values(grouped);
    }, [displayedImages]);

    return {
        tripId,
        imageGroupByDate,
        selectedImages,
        // defaultLocation,
        selectedLocation,
        isMapVisible,
        isUploading,
        handleHashtagSelect,
        handleMapLocationSelect,
        uploadImagesWithLocation,
        setIsMapVisible,
    };
};
