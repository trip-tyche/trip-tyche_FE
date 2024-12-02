import { useEffect, useMemo, useState } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import { ROUTES } from '@/constants/paths';
import { updateTripDate } from '@/services/trips';
import { useToastStore } from '@/stores/useToastStore';
import useUserDataStore from '@/stores/useUserDataStore';
import { ImageModel, ImageGroupByDate } from '@/types/image';
import { Location } from '@/types/location';
import { addGpsMetadataToImages } from '@/utils/piexif';

export const useLocationAdd = () => {
    const [displayedImages, setDisplayedImages] = useState<ImageModel[]>([]);
    const [selectedImages, setSelectedImages] = useState<ImageModel[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location>(null);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const isTripInfoEditing = useUserDataStore((state) => state.isTripInfoEditing);
    const setIsEditing = useUserDataStore((state) => state.setIsTripInfoEditing);
    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();
    const location = useLocation();
    const { tripId } = useParams();

    useEffect(() => {
        const { imagesNoLocationWithDate } = location.state;
        setDisplayedImages(imagesNoLocationWithDate);
    }, []);

    // 그리드: 사진 토글 함수
    const handleHashtagSelect = (image: ImageModel) => {
        setSelectedImages((selectedImages) => {
            const isSelected = selectedImages.some((selectedImage) => selectedImage.image.name === image.image.name);
            if (isSelected) {
                return selectedImages.filter((selectedImage) => selectedImage.image.name !== image.image.name);
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
    const updateDisplayedImages = () => {
        const updatedDisplayedImages = displayedImages.filter((displayedImage) => {
            const isSelected = selectedImages.some(
                (selectedImage) => selectedImage.image.name === displayedImage.image.name,
            );
            return !isSelected;
        });

        if (updatedDisplayedImages.length === 0) {
            if (isTripInfoEditing) {
                navigate(`${ROUTES.PATH.TRIPS.ROOT}`);
                setIsEditing(false);
            } else {
                navigate(`${ROUTES.PATH.TRIPS.NEW.INFO(Number(tripId))}`);
                return;
            }
        }

        setDisplayedImages(updatedDisplayedImages);
        setSelectedImages([]);
        setSelectedLocation(null);
        setIsMapVisible(false);
    };

    // 이미지 업로드
    const uploadImages = async (images: ImageModel[]) => {
        try {
            if (!tripId) {
                return;
            }

            if (isTripInfoEditing) {
                await updateTripDate(
                    tripId,
                    images.map((image) => image.formattedDate),
                );
            }

            const imagesToUpload = images.map((image) => image.image);

            setIsUploading(true);
            await tripAPI.createTripImages(tripId, imagesToUpload);
        } catch (error) {
            showToast('다시 로그인해주세요.');
            navigate(ROUTES.PATH.AUTH.LOGIN);
        } finally {
            setIsUploading(false);
        }
    };

    // 지도: 메타데이터 업데이트 및 이미지 업로드
    const uploadImagesWithLocation = async () => {
        if (!selectedLocation) {
            return;
        }

        const updatedImages = await addGpsMetadataToImages(selectedImages, selectedLocation);
        await uploadImages(updatedImages);

        updateDisplayedImages();

        showToast(`${updatedImages.length}장의 사진이 추가되었습니다.`);
        // console.log('이미지에 위치가 등록되었습니다.', updatedImages, '선택한 위치:', selectedLocation);
    };

    const imageGroupByDate = useMemo(() => {
        const groups: ImageGroupByDate = displayedImages.reduce((acc, image) => {
            const date = image.formattedDate;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(image);
            return acc;
        }, {} as ImageGroupByDate);
        return Object.entries(groups).sort(([dateA], [dateB]) => dateA.localeCompare(dateB));
    }, [displayedImages]);

    return {
        tripId,
        imageGroupByDate,
        selectedImages,
        selectedLocation,
        isMapVisible,
        isUploading,
        handleHashtagSelect,
        handleMapLocationSelect,
        uploadImagesWithLocation,
        setIsMapVisible,
    };
};
