import { useState } from 'react';

import imageCompression from 'browser-image-compression';
import { useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import { COMPRESSION_OPTIONS } from '@/constants/images';
import { updateTripDate } from '@/services/trips';
import { useUploadStore } from '@/stores/useUploadingStore';
import useUserDataStore from '@/stores/useUserDataStore';
import { ImageModel, PresignedUrlResponse } from '@/types/image';
import { Location } from '@/types/location';
import { formatToISOLocal } from '@/utils/date';
import { getImageLocation, extractDateFromImage } from '@/utils/piexif';

export const useImageUpload = () => {
    const [imageCount, setImagesCount] = useState(0);
    const [imagesWithLocationAndDate, setImagesWithLocationAndDate] = useState<ImageModel[]>([]);
    const [imagesNoLocationWithDate, setImagesNoLocationWithDate] = useState<ImageModel[]>([]);
    const [imagesNoDate, setImagesNoDate] = useState<ImageModel[]>([]);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isAlertModalOpen, setIsAlertModalModalOpen] = useState(false);

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

        const extractedImages = await Promise.all(
            Array.from(images).map(async (image) => {
                console.log(image);
                if (image.name.startsWith('temp')) {
                    console.log('image/heic');
                }

                const location = await getImageLocation(image);
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
        const batchSize = 1;

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
        if (!tripId || !images.length) {
            return;
        }

        if (isTripInfoEditing) {
            await updateTripDate(
                tripId,
                images.map((image) => image.formattedDate.split('T')[0]),
            );
        }

        try {
            setUploadStatus('pending');

            console.time(`리사이징 시간`);
            const resizedImages = await resizeImage(images);
            console.timeEnd(`리사이징 시간`);

            const files = resizedImages.map((image) => ({
                fileName: image.image.name,
                fileType: image.image.type,
            }));

            const presignedUrls = await tripImageAPI.requestPresignedUploadUrls(tripId, files);
            console.log(presignedUrls);

            console.time(`S3 업로드 시간`);
            await Promise.all(
                presignedUrls.map((urlInfo: PresignedUrlResponse, index: number) =>
                    tripImageAPI.uploadToS3(urlInfo.presignedPutUrl, resizedImages[index].image),
                ),
            );
            console.timeEnd(`S3 업로드 시간`);

            const uploadedFiles = presignedUrls.map((urlInfo: PresignedUrlResponse, index: number) => ({
                mediaLink: urlInfo.presignedPutUrl.split('?')[0],
                latitude: resizedImages[index].location ? resizedImages[index]?.location.latitude : 0,
                longitude: resizedImages[index].location ? resizedImages[index]?.location.longitude : 0,
                recordDate: resizedImages[index].formattedDate,
                mediaType: resizedImages[index].image.type,
            }));

            console.time(`서버 데이터 전송 시간`);
            await tripImageAPI.registerTripMediaFiles(tripId, uploadedFiles);
            console.timeEnd(`서버 데이터 전송 시간`);
            setUploadStatus('completed');
        } catch (error) {
            setUploadStatus('error');
        }
    };

    return {
        tripId,
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
