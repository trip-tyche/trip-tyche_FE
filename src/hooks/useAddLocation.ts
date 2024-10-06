import { useEffect, useState } from 'react';

import piexif from 'piexifjs';
import { useLocation, useNavigate } from 'react-router-dom';

import { postTripImages } from '@/api/trip';
import { PATH } from '@/constants/path';
import { useToastStore } from '@/stores/useToastStore';
import { getUserId } from '@/utils/auth';
import { createGpsExif, insertExifIntoJpeg, readFileAsDataURL } from '@/utils/piexif';

interface ImageWithDate {
    file: File;
    formattedDate: string; // YYYY-MM-DD 형식
}

export const useAddLocation = () => {
    const [displayedImages, setDisplayedImages] = useState<ImageWithDate[]>([]);
    const [selectedImages, setSelectedImages] = useState<ImageWithDate[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { showToast } = useToastStore();

    const navigate = useNavigate();
    const location = useLocation();
    const { defaultLocation, imagesNoLocation } = location.state; // 나중에 restful하게 수정하자

    useEffect(() => {
        if (imagesNoLocation.length === 0) {
            showToast('모든 사진의 위치 정보가 없습니다.');
            navigate(PATH.TRIP_LIST, { state: { toastMessage: '모든 사진의 위치 정보가 없습니다.' } });
            return;
        }
        setDisplayedImages(imagesNoLocation);
    }, []);

    const toggleImageSelection = (image: ImageWithDate) => {
        setSelectedImages((prev) => {
            const isSelected = prev.some((item) => item.file.name === image.file.name);

            if (isSelected) {
                return prev.filter((item) => item.file.name !== image.file.name);
            } else {
                return [...prev, image];
            }
        });
    };

    const goToTripList = () => {
        navigate(PATH.TRIP_LIST);
    };

    const handleNextClick = () => {
        if (selectedImages.length > 0) {
            setShowMap(true);
        }
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedLocation({ lat, lng });
    };

    const handleConfirmLocation = async () => {
        if (!selectedLocation) {
            console.warn('Location is not selected.');
            return;
        }

        console.log('Selected images:', selectedImages);
        console.log('Selected location:', selectedLocation);

        const updatedImages = await Promise.all(
            selectedImages.map(async (image) => {
                const exifObj = piexif.load(await readFileAsDataURL(image.file));
                const gpsExif = createGpsExif(selectedLocation.lat, selectedLocation.lng);

                const newExif = { ...exifObj, ...gpsExif };
                const exifStr = piexif.dump(newExif);

                const newImageBlob = await insertExifIntoJpeg(image.file, exifStr);
                return {
                    file: new File([newImageBlob], image.file.name, { type: image.file.type }),
                    formattedDate: image.formattedDate,
                };
            }),
        );

        console.log('Images with updated location:', updatedImages);

        const updatedDisplayedImages = displayedImages.filter(
            (image) => !selectedImages.some((selected) => selected.file.name === image.file.name),
        );

        try {
            setIsLoading(true);
            const userId = getUserId();
            if (!userId) {
                return;
            }
            await postTripImages(
                userId,
                updatedImages.map((img) => img.file),
            );
        } catch (error) {
            console.error('Error post trip-images:', error);
        } finally {
            setIsLoading(false);
        }

        if (updatedDisplayedImages.length === 0) {
            navigate(PATH.TRIP_LIST);
            return;
        }

        setDisplayedImages(updatedDisplayedImages);
        setSelectedImages([]);

        setShowMap(false);
    };

    return {
        defaultLocation,
        displayedImages,
        selectedImages,
        selectedLocation,
        showMap,
        setShowMap,
        isLoading,
        toggleImageSelection,
        goToTripList,
        handleNextClick,
        handleLocationSelect,
        handleConfirmLocation,
    };
};
