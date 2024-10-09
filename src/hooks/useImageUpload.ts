import { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { postTripImages } from '@/api/trip';
import { PATH } from '@/constants/path';
import { useModalStore } from '@/stores/useModalStore';
import { ImageWithLocationAndDate } from '@/types/image';
import { formatDateToYYYYMMDD } from '@/utils/date';
import { getImageLocation, extractDateFromImage } from '@/utils/piexif';

interface ImageWithDate {
    file: File;
    formattedDate: string; // YYYY-MM-DD 형식
}

export const useImageUpload = () => {
    const [imageCount, setImagesCount] = useState(0);
    const [imagesWithLocation, setImagesWithLocation] = useState<ImageWithLocationAndDate[]>([]);
    const [imagesNoLocation, setImagesNoLocation] = useState<ImageWithDate[]>([]);
    const [noDateImagesCount, setNoDateImagesCount] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { openModal, closeModal } = useModalStore();

    const navigate = useNavigate();
    const location = useLocation();

    const { tripId, startDate, endDate } = location.state;

    // 이미지 메타데이터의 위치 정보 유무 확인
    const handleFileUpload = async (files: FileList | null) => {
        if (!files) {
            return;
        }

        try {
            setIsLoading(true);
            const processedImages = await Promise.all(
                Array.from(files).map(async (file) => {
                    const location = await getImageLocation(file);
                    const date = await extractDateFromImage(file);

                    let formattedDate = '';
                    if (date) {
                        formattedDate = formatDateToYYYYMMDD(date);
                    }
                    return { file, formattedDate, location };
                }),
            );

            // startDate와 endDate 사이에 있는 이미지만 필터링
            const filteredImages = processedImages.filter((image) => {
                if (!image.formattedDate) return false;
                return image.formattedDate >= startDate && image.formattedDate <= endDate;
            });

            // 위치 정보가 있는 이미지
            const imagesWithLocation = filteredImages.filter((image) => image.location);
            setImagesWithLocation(imagesWithLocation);
            console.log('위치 ✅:', imagesWithLocation);

            // 위치 정보가 없는 이미지
            const noLocationImages = filteredImages
                .filter((image) => !image.location)
                .map(({ file, formattedDate }) => ({
                    file,
                    formattedDate,
                }));
            setImagesNoLocation(noLocationImages);
            console.log('위치 ⛔️:', noLocationImages);

            // 날짜 정보가 없는 이미지 (startDate와 endDate 범위 밖의 이미지 포함)
            const noDateImages = processedImages.filter(
                (image) =>
                    image.formattedDate === '' || image.formattedDate < startDate || image.formattedDate > endDate,
            );
            setNoDateImagesCount(noDateImages.length);
            console.log('날짜 ⛔️:', noDateImages);

            setImagesCount(files.length);
            setIsLoading(false);
        } catch (error) {
            console.error('Error processing files:', error);
        }
    };

    const uploadTripImages = async () => {
        try {
            setIsUploading(true);
            const images = imagesWithLocation.map((image) => image.file);
            if (images.length) {
                await postTripImages(tripId, images);
            }
            if (noDateImagesCount || imagesNoLocation.length) {
                openModal();
                return;
            }
            closeModal();
            navigate(PATH.TRIP_LIST);
        } catch (error) {
            console.error('Error post trip-images:', error);
            setIsUploading(false);
        } finally {
            setIsUploading(false);
        }
    };

    return {
        imageCount,
        imagesWithLocation,
        imagesNoLocation,
        noDateImagesCount,
        openModal,
        isLoading,
        isUploading,
        handleFileUpload,
        uploadTripImages,
    };
};
