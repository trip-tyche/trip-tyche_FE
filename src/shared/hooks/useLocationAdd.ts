import { useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { UnlocatedMediaFile, UnlocatedMediaFileList } from '@/domains/media/types';
import { mediaAPI } from '@/libs/apis';
import { ROUTES } from '@/shared/constants/route';
import { useTripDefaultLocation } from '@/shared/hooks/queries/useTripImage';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Location } from '@/shared/types/map';

export const useLocationAdd = () => {
    const [displayedImages, setDisplayedImages] = useState<UnlocatedMediaFileList[]>([]);
    const [selectedImages, setSelectedImages] = useState<UnlocatedMediaFile[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();
    const { tripKey } = useParams();

    const { data: defaultLocation } = useTripDefaultLocation(tripKey as string);
    const queryClient = useQueryClient();

    useEffect(() => {
        getUnlocatedImagesData();
    }, []);

    const getUnlocatedImagesData = async () => {
        if (!tripKey) {
            return;
        }

        const unlocatedImages = await mediaAPI.fetchUnlocatedImages(tripKey);
        if (!unlocatedImages) {
            navigate(`${ROUTES.PATH.MAIN}`);
            return;
        }
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

    const uploadImagesWithLocation = async () => {
        if (!selectedLocation) {
            return;
        }

        setIsUploading(true);
        try {
            const uploadPromise = selectedImages.map((image) =>
                mediaAPI.updateUnlocatedImages(tripKey as string, String(image.mediaFileId), selectedLocation),
            );

            await Promise.allSettled(uploadPromise);
            await getUnlocatedImagesData();

            queryClient.invalidateQueries({ queryKey: ['trip-default-location', tripKey] });

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
        const grouped = displayedImages.reduce<Record<string, UnlocatedMediaFileList>>((acc, curr) => {
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
        tripKey,
        imageGroupByDate,
        selectedImages,
        defaultLocation,
        selectedLocation,
        isMapVisible,
        isUploading,
        handleHashtagSelect,
        handleMapLocationSelect,
        uploadImagesWithLocation,
        setIsMapVisible,
    };
};
