import { useState } from 'react';

import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';

import { postTripImages } from '@/api/trip';
import { PATH } from '@/constants/path';
import { ImageModel } from '@/types/image';
import { formatDateToYYYYMMDD } from '@/utils/date';
import { getImageLocation, extractDateFromImage } from '@/utils/piexif';

export const useImageUpload = () => {
    const [imageCount, setImagesCount] = useState(0);
    const [imagesWithLocationAndDate, setImagesWithLocationAndDate] = useState<ImageModel[]>([]);
    const [imagesNoLocationWithDate, setImagesNoLocationWithDate] = useState<Omit<ImageModel, 'location'>[]>([]);
    const [imagesNoDate, setImagesNoDate] = useState<ImageModel[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

    const navigate = useNavigate();

    const extractImageMetadata = async (images: FileList | null): Promise<ImageModel[]> => {
        if (!images || images.length === 0) {
            return [];
        }

        return await Promise.all(
            Array.from(images).map(async (image) => {
                const location = await getImageLocation(image);
                const date = await extractDateFromImage(image);
                let formattedDate = '';
                if (date) {
                    formattedDate = formatDateToYYYYMMDD(date);
                }
                return {
                    image,
                    formattedDate,
                    location,
                };
            }),
        );
    };

    const resizeImage = async (extractedImages: ImageModel[] | null): Promise<ImageModel[]> => {
        if (!extractedImages || extractedImages.length === 0) {
            return [];
        }

        const compressionOptions = {
            maxWidthOrHeight: 856,
            initialQuality: 0.9,
            useWebWorker: true,
            preserveExif: true,
            fileType: 'image/jpeg',
        };

        const resizeStartTime = performance.now();

        const resizedImages = await Promise.all(
            extractedImages.map(async (extractedImage: ImageModel) => {
                try {
                    const resizedBlob = await imageCompression(extractedImage.image, compressionOptions);

                    // // Blob을 File로 변환
                    // const resizedFile = new File([resizedBlob], processedImage.file.name, {
                    // type: compressionOptions.fileType,
                    // lastModified: processedImage.file.lastModified,
                    // });

                    // console.log(`${processedImage.file.name} 변환 결과:`, {
                    //     originalSize: `${(processedImage.file.size / (1024 * 1024)).toFixed(2)}MB`,
                    //     convertedSize: `${(resizedBlob.size / (1024 * 1024)).toFixed(2)}MB`,
                    //     format: compressionOptions.fileType,
                    // });

                    return {
                        image: resizedBlob,
                        formattedDate: extractedImage.formattedDate,
                        location: extractedImage.location,
                    };
                } catch (error) {
                    console.error(`리사이징에 실패한 이미지: ${extractedImage.image.name}`, error);
                    return extractedImage;
                }
            }),
        );

        const resizeEndTime = performance.now();

        console.log(
            `총 ${extractedImages.length}개 이미지 리사이징 시간: ${(resizeEndTime - resizeStartTime).toFixed(2)}ms`,
        );

        return resizedImages;
    };

    const handleImageProcess = async (images: FileList | null) => {
        if (!images) {
            return;
        }

        try {
            setIsProcessing(true);

            const extractedImages = await extractImageMetadata(images);
            const resizedImages = await resizeImage(extractedImages);

            const imagesWithLocationAndDate = resizedImages.filter((image) => image.location && image.formattedDate);
            const imagesNoLocationWithDate = resizedImages.filter((image) => !image.location && image.formattedDate);
            const imagesNoDate = resizedImages.filter((image) => !image.formattedDate);

            setImagesCount(images.length);
            setImagesWithLocationAndDate(imagesWithLocationAndDate);
            setImagesNoLocationWithDate(imagesNoLocationWithDate);
            setImagesNoDate(imagesNoDate);

            console.log('위치 ✅ / 날짜 ✅:', imagesWithLocationAndDate);
            console.log('위치 ⛔️ / 날짜 ✅:', imagesNoLocationWithDate);
            console.log('날짜 ⛔️:', imagesNoDate);

            const sortedImagesDates = imagesWithLocationAndDate
                .filter((image) => image.formattedDate)
                .map((image) => image.formattedDate)
                .sort();

            if (sortedImagesDates.length > 0) {
                const earliestDate = sortedImagesDates[0];
                const latestDate = sortedImagesDates[sortedImagesDates.length - 1];

                localStorage.setItem('earliest-date', earliestDate);
                localStorage.setItem('latest-date', latestDate);

                console.log(`시작일: ${earliestDate} / 종료일: ${latestDate}`);
            }

            setIsProcessing(false);
        } catch (error) {
            console.error('이미지 처리 중 오류 발생', error);
            setIsProcessing(false);
        } finally {
            setIsProcessing(false);
        }
    };

    const uploadImages = async () => {
        const tripId = localStorage.getItem('tripId');

        if (!tripId) {
            console.error('Trip ID가 필요합니다.');
            return;
        }

        const images = imagesWithLocationAndDate.map((image) => image.image);

        setIsUploading(true);

        postTripImages(tripId, images)
            .then((message) => console.log('이미지 업로드 완료:', message))
            .catch((error) => console.error('이미지 업로드 중 오류 발생:', error));

        await new Promise<void>((resolve) => setTimeout(resolve, 1500));
        setIsUploading(false);

        if (imagesNoLocationWithDate.length) {
            setIsGuideModalOpen(true);
            return;
        }

        navigate(PATH.TRIP_NEW);
    };

    return {
        imageCount,
        imagesWithLocationAndDate,
        imagesNoLocationWithDate,
        imagesNoDate,
        isProcessing,
        isUploading,
        isGuideModalOpen,
        handleImageProcess,
        uploadImages,
        setIsUploading,
        setIsGuideModalOpen,
    };
};
