import { useState } from 'react';

import imageCompression from 'browser-image-compression';

import { postTripImages } from '@/api/trip';
import { useUploadStore } from '@/stores/useUploadingStore';
import { ImageModel } from '@/types/image';
import { formatDateToYYYYMMDD } from '@/utils/date';
import { getImageLocation, extractDateFromImage } from '@/utils/piexif';

export const useImageUpload = () => {
    const [imageCount, setImagesCount] = useState(0);
    const [imagesWithLocationAndDate, setImagesWithLocationAndDate] = useState<ImageModel[]>([]);
    const [imagesNoLocationWithDate, setImagesNoLocationWithDate] = useState<ImageModel[]>([]);
    const [imagesNoDate, setImagesNoDate] = useState<ImageModel[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isAlertModalOpen, setIsAlertModalModalOpen] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);

    const setUploadStatus = useUploadStore((state) => state.setUploadStatus);

    const extractImageMetadata = async (images: FileList | null): Promise<ImageModel[]> => {
        if (!images || images.length === 0) {
            return [];
        }

        const extractStartTime = performance.now();
        const extractedImages = await Promise.all(
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

        const extractEndTime = performance.now();
        console.log(`메타데이터 추출 시간: ${(extractEndTime - extractStartTime).toFixed(2)}ms`);

        return extractedImages;
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

                    const resizedFile = new File([resizedBlob], extractedImage.image.name, {
                        type: compressionOptions.fileType,
                        lastModified: extractedImage.image.lastModified,
                    });

                    // console.log(`${extractedImage.image.name} 변환 결과:`, {
                    //     originalSize: `${(extractedImage.image.size / (1024 * 1024)).toFixed(2)}MB`,
                    //     convertedSize: `${(resizedBlob.size / (1024 * 1024)).toFixed(2)}MB`,
                    //     format: compressionOptions.fileType,
                    // });

                    return {
                        image: resizedFile,
                        formattedDate: extractedImage.formattedDate,
                        location: extractedImage.location,
                    };
                } catch (error) {
                    return extractedImage;
                    // console.error(`리사이징에 실패한 이미지: ${extractedImage.image.name}`, error);
                }
            }),
        );

        const resizeEndTime = performance.now();
        console.log(`리사이징 시간: ${(resizeEndTime - resizeStartTime).toFixed(2)}ms`);

        return resizedImages;
    };

    const removeDuplicateImages = (images: FileList): FileList => {
        const imageMap = new Map();

        Array.from(images).forEach((image) => {
            imageMap.set(image.name, image);
        });

        const dataTransfer = new DataTransfer();

        imageMap.values().forEach((image: File) => {
            dataTransfer.items.add(image);
        });

        return dataTransfer.files;
    };

    const handleImageProcess = async (images: FileList | null) => {
        if (!images) {
            return;
        }

        try {
            const uniqueImages = removeDuplicateImages(images);
            const extractedImages = await extractImageMetadata(uniqueImages);

            const sortedImagesDates = extractedImages
                .filter((image) => image.formattedDate)
                .map((image) => image.formattedDate)
                .sort();

            const uniqueSortedImagesDates = [...new Set(sortedImagesDates)];
            localStorage.setItem('image-date', JSON.stringify(uniqueSortedImagesDates));

            const imagesWithLocationAndDate = extractedImages.filter((image) => image.location && image.formattedDate);
            const imagesNoLocationWithDate = extractedImages.filter((image) => !image.location && image.formattedDate);
            const imagesNoDate = extractedImages.filter((image) => !image.formattedDate);

            setImagesCount(images.length);
            setImagesWithLocationAndDate(imagesWithLocationAndDate);
            setImagesNoLocationWithDate(imagesNoLocationWithDate);
            setImagesNoDate(imagesNoDate);
            setIsAlertModalModalOpen(true);

            resizeAndUploadImages(imagesWithLocationAndDate, imagesNoLocationWithDate);

            console.log('위치 ✅ / 날짜 ✅:', imagesWithLocationAndDate);
            console.log('위치 ⛔️ / 날짜 ✅:', imagesNoLocationWithDate);
            console.log('날짜 ⛔️:', imagesNoDate);
        } catch (error) {
            console.error('이미지 처리 중 오류 발생', error);
        }
    };

    const resizeAndUploadImages = async (
        imagesWithLocationAndDate: ImageModel[],
        imagesNoLocationWithDate: ImageModel[],
    ) => {
        const tripId = localStorage.getItem('tripId');
        if (!tripId) {
            console.error('Trip ID가 필요합니다.');
            return;
        }

        setUploadStatus('pending');

        const [resizedImagesWithLocationAndDate, resizedImagesNoLocationWithDate] = await Promise.all([
            resizeImage(imagesWithLocationAndDate),
            resizeImage(imagesNoLocationWithDate),
        ]);

        setImagesWithLocationAndDate(resizedImagesWithLocationAndDate);
        setImagesNoLocationWithDate(resizedImagesNoLocationWithDate);

        const images = resizedImagesWithLocationAndDate.map((image) => image.image);

        postTripImages(tripId, images)
            .then((message) => {
                console.log('이미지 업로드 완료:', message);
                setUploadStatus('completed');
            })
            .catch((error) => {
                console.error('이미지 업로드 중 오류 발생:', error);
                setUploadStatus('error');
            });
    };

    return {
        imageCount,
        imagesWithLocationAndDate,
        imagesNoLocationWithDate,
        imagesNoDate,
        isAlertModalOpen,
        isInvalid,
        isAddLocationModalOpen,
        setIsInvalid,
        setIsAlertModalModalOpen,
        // isUploading,
        handleImageProcess,
        setIsAddLocationModalOpen,
    };
};
