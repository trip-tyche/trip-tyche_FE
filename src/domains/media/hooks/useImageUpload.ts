import { useState } from 'react';

import imageCompression from 'browser-image-compression';
import { useParams } from 'react-router-dom';

import { COMPRESSION_OPTIONS } from '@/domains/media/constants';
import { ImageModel, PresignedUrlResponse } from '@/domains/media/image';
import { mediaAPI } from '@/libs/apis';
import { formatToISOLocal } from '@/libs/utils/date';
import { extractLocationFromImage, extractDateFromImage } from '@/libs/utils/exif';
import { removeDuplicateImages } from '@/libs/utils/image';
import { useUploadStatusStore } from '@/shared/stores/useUploadStatusStore';
import { Location } from '@/shared/types/location';

export const useImageUpload = () => {
    const [imageCount, setImagesCount] = useState(0);
    const [imagesWithLocationAndDate, setImagesWithLocationAndDate] = useState<ImageModel[]>([]);
    const [imagesNoLocationWithDate, setImagesNoLocationWithDate] = useState<ImageModel[]>([]);
    const [imagesNoDate, setImagesNoDate] = useState<ImageModel[]>([]);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isAlertModalOpen, setIsAlertModalModalOpen] = useState(false);

    const setUploadStatus = useUploadStatusStore((state) => state.setUploadStatus);

    const { tripKey } = useParams();

    const hasValidLocation = (location: Location): boolean => location !== null;

    const extractImageMetadata = async (images: FileList | null): Promise<ImageModel[]> => {
        if (!images || images.length === 0) {
            return [];
        }

        const extractedImages = await Promise.all(
            Array.from(images).map(async (image) => {
                const location = await extractLocationFromImage(image);
                const date = await extractDateFromImage(image);
                let formattedDate = '';

                if (date) {
                    formattedDate = formatToISOLocal(date);
                }

                return {
                    image,
                    formattedDate,
                    location,
                };
            }),
        );

        return extractedImages;
    };

    const handleImageProcess = async (images: FileList | null) => {
        if (!images) {
            return;
        }

        const uniqueImages = removeDuplicateImages(images);
        setIsExtracting(true);
        console.time(`메타데이터 추출 시간`);
        const extractedImages = await extractImageMetadata(uniqueImages);
        console.timeEnd(`메타데이터 추출 시간`);
        setIsExtracting(false);

        const sortedImagesDates = extractedImages
            .filter((image) => image.formattedDate)
            .map((image) => image.formattedDate.split('T')[0])
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
    };

    const resizeImage = async (extractedImages: ImageModel[] | null): Promise<ImageModel[]> => {
        if (!extractedImages || extractedImages.length === 0) {
            return [];
        }

        const resizedImages: ImageModel[] = [];
        const batchSize = 10;

        for (let i = 0; i < extractedImages.length; i += batchSize) {
            const batch = extractedImages.slice(i, i + batchSize);

            const batchResults = await Promise.all(
                batch.map(async (extractedImage: ImageModel) => {
                    try {
                        const resizedBlob = await imageCompression(extractedImage.image, COMPRESSION_OPTIONS);
                        const resizedFile = new File(
                            [resizedBlob],
                            extractedImage.image.name.replace(/\.[^/.]+$/, '.webp'),
                            {
                                type: COMPRESSION_OPTIONS.fileType,
                                lastModified: extractedImage.image.lastModified,
                            },
                        );

                        URL.revokeObjectURL(URL.createObjectURL(resizedBlob));

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
        }

        return resizedImages;
    };

    const uploadImages = async (images: ImageModel[]) => {
        if (!tripKey || !images.length) {
            return;
        }

        // if (isTripInfoEditing) {
        //     await updateTripDate(
        //         tripKey,
        //         images.map((image) => image.formattedDate.split('T')[0]),
        //     );
        // }

        try {
            setUploadStatus('pending');

            console.time(`리사이징 시간`);
            // const resizedImages = images;
            const resizedImages = await resizeImage(images);
            console.timeEnd(`리사이징 시간`);

            const fileNames = resizedImages.map((image) => ({
                fileName: image.image.name,
            }));

            const result = await mediaAPI.requestPresignedUrls(tripKey, fileNames);
            if (!result.success) throw new Error(result.error);
            const { data: presignedUrls } = result;

            console.time(`S3 업로드 시간`);
            await Promise.all(
                presignedUrls.map((urlInfo: PresignedUrlResponse, index: number) =>
                    mediaAPI.uploadToS3(urlInfo.presignedPutUrl, resizedImages[index].image),
                ),
            );

            console.timeEnd(`S3 업로드 시간`);

            const metaDatas = presignedUrls.map((urlInfo: PresignedUrlResponse, index: number) => {
                const { formattedDate: recordDate, location } = resizedImages[index];
                const { latitude = 0, longitude = 0 } = location || {};

                return {
                    mediaLink: urlInfo.presignedPutUrl.split('?')[0], // URL 뒤 불필요한 정보 제거
                    latitude,
                    longitude,
                    recordDate,
                };
            });

            console.time(`서버 데이터 전송 시간`);
            await mediaAPI.createMediaFileMetadata(tripKey, metaDatas);
            console.timeEnd(`서버 데이터 전송 시간`);
            setUploadStatus('completed');
        } catch (error) {
            console.error(error);
            setUploadStatus('error');
        }
    };

    return {
        tripKey,
        imageCount,
        imagesWithLocationAndDate,
        imagesNoLocationWithDate,
        imagesNoDate,
        isExtracting,
        isAlertModalOpen,
        setIsAlertModalModalOpen,
        handleImageProcess,
        uploadImages,
    };
};
