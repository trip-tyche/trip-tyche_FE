import { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { postTripImages } from '@/api/trip';
import { PATH } from '@/constants/path';
import { useModalStore } from '@/stores/useModalStore';
import { ImageWithLocation } from '@/types/image';
import { getImageLocation } from '@/utils/piexif';

export const useImageUpload = () => {
    const [imageCount, setImagesCount] = useState(0);
    const [imagesWithLocation, setImagesWithLocation] = useState<ImageWithLocation[]>([]);
    const [imagesNoLocation, setImagesNoLocation] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { openModal, closeModal } = useModalStore();

    const navigate = useNavigate();
    const location = useLocation();

    const tripId = location.state;

    // 이미지 메타데이터의 위치 정보 유무 확인
    const handleFileUpload = async (files: FileList | null) => {
        if (!files) {
            return;
        }
        setImagesCount(files.length);

        try {
            const processedImages = await Promise.all(
                Array.from(files).map(async (file) => {
                    const location = await getImageLocation(file);
                    // console.log(`Location for ${file.name}:`, location);
                    return { file, location };
                }),
            );

            // 위치 정보가 없는 이미지
            const noLocationImages = processedImages.filter((image) => !image.location).map((image) => image.file);
            setImagesNoLocation(noLocationImages);

            // 위치 정보가 있는 이미지
            const filteredImages = processedImages.filter((image) => image.location);
            setImagesWithLocation(filteredImages);
            console.log('Filtered images:', filteredImages);
        } catch (error) {
            console.error('Error processing files:', error);
        }
    };

    const uploadTripImages = async () => {
        try {
            setIsLoading(true);
            const images = imagesWithLocation.map((image) => image.file);
            if (images.length) {
                await postTripImages(tripId, images);
            }
            if (imagesNoLocation.length) {
                openModal();
                return;
            }
            closeModal();
            navigate(PATH.TRIP_LIST);
        } catch (error) {
            console.error('Error post trip-images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        imageCount,
        imagesWithLocation,
        imagesNoLocation,
        // isModalOpen,
        openModal,
        // closeModal,
        isLoading,
        handleFileUpload,
        uploadTripImages,
    };
};
