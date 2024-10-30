import { useState } from 'react';

import imageCompression from 'browser-image-compression';
import { useLocation, useNavigate } from 'react-router-dom';

import { postTripImages } from '@/api/trip';
import { PATH } from '@/constants/path';
import { useToastStore } from '@/stores/useToastStore';
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
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { showToast } = useToastStore();

    const navigate = useNavigate();
    const location = useLocation();

    const { tripId, startDate, endDate } = location.state;

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
                    return {
                        file,
                        formattedDate,
                        location,
                    };
                }),
            );

            console.log(startDate, endDate);

            // 이미지 리사이징
            const resizeStartTime = performance.now();

            const compressionOptions = {
                maxWidthOrHeight: 846, // 원하는 너비
                initialQuality: 0.9, // 품질 설정 (0과 1 사이)
                useWebWorker: true, // WebWorker 사용
                preserveExif: true, // EXIF 데이터 보존
                fileType: 'image/jpeg', // 출력 포맷
            };

            const finalProcessedImages = await Promise.all(
                processedImages.map(async (processedImage) => {
                    try {
                        // 이미지 리사이징
                        const resizedFile = await imageCompression(processedImage.file, compressionOptions);

                        return {
                            file: resizedFile,
                            formattedDate: processedImage.formattedDate,
                            location: processedImage.location,
                        };
                    } catch (error) {
                        console.error(`Error resizing image: ${processedImage.file.name}`, error);
                        // 리사이징 실패 시 원본 반환
                        return processedImage;
                    }
                }),
            );

            const resizeEndTime = performance.now();
            console.log(`총 ${files.length}개 이미지 리사이징 시간: ${(resizeEndTime - resizeStartTime).toFixed(2)}ms`);

            // startDate와 endDate 사이에 있는 이미지만 필터링
            const filteredImages = finalProcessedImages.filter((image) => {
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
            console.log(images);
            if (images.length === 0) {
                setIsGuideModalOpen(true);
                return;
            }

            await postTripImages(tripId, images);

            if (imagesNoLocation.length) {
                setIsGuideModalOpen(true);
                return;
            }

            navigate(PATH.TRIP_LIST);
            showToast('사진이 업로드되었습니다.');
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
        isGuideModalOpen,
        isLoading,
        isUploading,
        handleFileUpload,
        uploadTripImages,
        setIsGuideModalOpen,
    };
};
