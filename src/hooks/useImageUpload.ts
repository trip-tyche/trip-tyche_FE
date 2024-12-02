import { useState } from 'react';

import imageCompression from 'browser-image-compression';
import { useParams } from 'react-router-dom';

import { tripAPI } from '@/api';
import { updateTripDate } from '@/services/trips';
import { useUploadStore } from '@/stores/useUploadingStore';
import useUserDataStore from '@/stores/useUserDataStore';
import { ImageModel } from '@/types/image';
import { Location } from '@/types/location';
import { formatToYYYYMMDD } from '@/utils/date';
import { getImageLocation, extractDateFromImage } from '@/utils/piexif';

export const useImageUpload = () => {
    const [imageCount, setImagesCount] = useState(0);
    const [imagesWithLocationAndDate, setImagesWithLocationAndDate] = useState<ImageModel[]>([]);
    const [imagesNoLocationWithDate, setImagesNoLocationWithDate] = useState<ImageModel[]>([]);
    const [imagesNoDate, setImagesNoDate] = useState<ImageModel[]>([]);
    const [isAlertModalOpen, setIsAlertModalModalOpen] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizingProgress, setResizingProgress] = useState(0);
    const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);

    const setUploadStatus = useUploadStore((state) => state.setUploadStatus);
    const isTripInfoEditing = useUserDataStore((state) => state.isTripInfoEditing);

    const { tripId } = useParams();

    const removeDuplicateImages = (images: FileList): FileList => {
        const imageMap = new Map();

        Array.from(images).forEach((image) => {
            imageMap.set(image.name, image);
        });

        const dataTransfer = new DataTransfer();

        Array.from(imageMap.values()).forEach((image: File) => {
            dataTransfer.items.add(image);
        });

        return dataTransfer.files;
    };

    const hasValidLocation = (location: Location): boolean => location !== null;

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
                    formattedDate = formatToYYYYMMDD(date);
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

    const resizeImage = async (
        extractedImages: ImageModel[] | null,
        progressRange: { start: number; end: number },
    ): Promise<ImageModel[]> => {
        if (!extractedImages || extractedImages.length === 0) {
            return [];
        }

        const compressionOptions = {
            maxWidthOrHeight: 1284,
            initialQuality: 0.8,
            useWebWorker: true,
            preserveExif: true,
            fileType: 'image/jpeg',
        };

        const resizeStartTime = performance.now();

        const resizedImages: ImageModel[] = [];
        const batchSize = 3;
        const progressSpan = progressRange.end - progressRange.start;

        for (let i = 0; i < extractedImages.length; i += batchSize) {
            const batch = extractedImages.slice(i, i + batchSize);

            const batchResults = await Promise.all(
                batch.map(async (extractedImage: ImageModel) => {
                    try {
                        const resizedBlob = await imageCompression(extractedImage.image, compressionOptions);
                        const resizedFile = new File([resizedBlob], extractedImage.image.name, {
                            type: compressionOptions.fileType,
                            lastModified: extractedImage.image.lastModified,
                        });

                        return {
                            image: resizedFile,
                            formattedDate: extractedImage.formattedDate,
                            location: extractedImage.location,
                        };
                    } catch (error) {
                        return extractedImage;
                    }
                }),
            );

            resizedImages.push(...batchResults);

            // 현재 진행률 계산
            const batchProgress = ((i + batch.length) / extractedImages.length) * progressSpan;
            setResizingProgress(Math.round(progressRange.start + batchProgress));
        }
        const resizeEndTime = performance.now();
        console.log(`리사이징 추출 시간: ${(resizeEndTime - resizeStartTime).toFixed(2)}ms`);

        return resizedImages;
    };

    const handleImageProcess = async (images: FileList | null) => {
        if (!images) {
            return;
        }

        try {
            const uniqueImages = removeDuplicateImages(images);
            setIsExtracting(true);
            const extractedImages = await extractImageMetadata(uniqueImages);
            setIsExtracting(false);

            const sortedImagesDates = extractedImages
                .filter((image) => image.formattedDate)
                .map((image) => image.formattedDate)
                .sort();

            const uniqueSortedImagesDates = [...new Set(sortedImagesDates)];
            localStorage.setItem('image-date', JSON.stringify(uniqueSortedImagesDates));

            const imagesWithLocationAndDate = extractedImages.filter(
                (image) => image.formattedDate && hasValidLocation(image.location),
            );
            const imagesNoLocationWithDate = extractedImages.filter(
                (image) => image.formattedDate && !hasValidLocation(image.location),
            );
            const imagesNoDate = extractedImages.filter((image) => !image.formattedDate);

            setImagesCount(images.length);
            setImagesWithLocationAndDate(imagesWithLocationAndDate);
            setImagesNoLocationWithDate(imagesNoLocationWithDate);
            setImagesNoDate(imagesNoDate);
            setIsAlertModalModalOpen(true);

            if (!imagesWithLocationAndDate.length && !imagesNoLocationWithDate.length) {
                return;
            }

            setIsResizing(true);
            setResizingProgress(0);

            // 존재하는 이미지 그룹에 따라 진행률 범위 설정
            let resizedWithLocation, resizedNoLocation;

            if (imagesWithLocationAndDate.length && imagesNoLocationWithDate.length) {
                // 두 그룹 모두 있는 경우
                [resizedWithLocation, resizedNoLocation] = await Promise.all([
                    resizeImage(imagesWithLocationAndDate, { start: 0, end: 50 }),
                    resizeImage(imagesNoLocationWithDate, { start: 50, end: 100 }),
                ]);
            } else if (imagesWithLocationAndDate.length) {
                // 위치 있는 이미지만 있는 경우
                resizedWithLocation = await resizeImage(imagesWithLocationAndDate, { start: 0, end: 100 });
            } else if (imagesNoLocationWithDate.length) {
                // 위치 없는 이미지만 있는 경우
                resizedNoLocation = await resizeImage(imagesNoLocationWithDate, { start: 0, end: 100 });
            }

            setIsResizing(false);
            setResizingProgress(0);

            setImagesWithLocationAndDate(resizedWithLocation || []);
            setImagesNoLocationWithDate(resizedNoLocation || []);
        } catch (error) {
            console.error('이미지 처리 중 오류 발생', error);
            setIsExtracting(false);
            setIsResizing(false);
        }
    };

    const uploadImages = async (images: ImageModel[]) => {
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

        setUploadStatus('pending');
        if (imagesToUpload.length > 0) {
            tripAPI
                .createTripImages(tripId, imagesToUpload)
                .then(() => {
                    setUploadStatus('completed');
                })
                .catch(() => {
                    setUploadStatus('error');
                });
        } else {
            setUploadStatus('completed');
        }
    };

    return {
        tripId,
        imageCount,
        imagesWithLocationAndDate,
        imagesNoLocationWithDate,
        imagesNoDate,
        isExtracting,
        isResizing,
        resizingProgress,
        isAlertModalOpen,
        isAddLocationModalOpen,
        setIsAlertModalModalOpen,
        handleImageProcess,
        setIsAddLocationModalOpen,
        uploadImages,
    };
};
