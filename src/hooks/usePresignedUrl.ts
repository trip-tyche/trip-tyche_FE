import { useState } from 'react';

import imageCompression from 'browser-image-compression';
import { useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
// import { updateTripDate } from '@/services/trips';
// import { useUploadStore } from '@/stores/useUploadingStore';
// import useUserDataStore from '@/stores/useUserDataStore';
import { ImageModel } from '@/types/image';
import { Location } from '@/types/location';
import { formatToISOLocal, formatToYYYYMMDD } from '@/utils/date';
import { getImageLocation, extractDateFromImage } from '@/utils/piexif';

export const usePresignedUrl = () => {
    const [imageCount, setImagesCount] = useState(0);
    const [imagesWithLocationAndDate, setImagesWithLocationAndDate] = useState<ImageModel[]>([]);
    const [imagesNoLocationWithDate, setImagesNoLocationWithDate] = useState<ImageModel[]>([]);
    const [imagesNoDate, setImagesNoDate] = useState<ImageModel[]>([]);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isAlertModalOpen, setIsAlertModalModalOpen] = useState(false);
    const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);

    // const setUploadStatus = useUploadStore((state) => state.setUploadStatus);
    // const isTripInfoEditing = useUserDataStore((state) => state.isTripInfoEditing);

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
        console.time('메타데이터 추출 시간');
        const extractedImages = await extractImageMetadata(uniqueImages);
        console.timeEnd('메타데이터 추출 시간');
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
    };

    const resizeImage = async (
        extractedImages: ImageModel[] | null,
        // progressRange: { start: number; end: number },
    ): Promise<ImageModel[]> => {
        if (!extractedImages || extractedImages.length === 0) {
            return [];
        }

        // const compressionOptions = {
        //     maxWidthOrHeight: 1284,
        //     initialQuality: 0.8,
        //     useWebWorker: true,
        //     preserveExif: true,
        //     fileType: 'image/jpeg',
        // };
        const compressionOptions = {
            // 일반적인 디스플레이와 모바일 기기를 고려한 최적 너비
            maxWidthOrHeight: 1280,

            // 웹 최적화를 위한 설정
            initialQuality: 0.7, // 0.7은 품질과 파일 크기의 좋은 균형점
            useWebWorker: true, // 메인 스레드 차단 방지
            preserveExif: true, // 메타데이터 유지

            // WebP 지원을 위한 설정
            fileType: 'image/webp',
            // WebP 특정 옵션
            webpOptions: {
                quality: 0.7,
                lossless: false, // 손실 압축 사용
                nearLossless: false,
                alpha_quality: 1,
                method: 4, // 0-6 사이 값, 높을수록 압축률이 좋지만 시간이 더 걸림
            },
        };

        const resizeStartTime = performance.now();

        const resizedImages: ImageModel[] = [];
        const batchSize = 3;
        // const progressSpan = progressRange.end - progressRange.start;

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
            // const batchProgress = ((i + batch.length) / extractedImages.length) * progressSpan;
            // setResizingProgress(Math.round(progressRange.start + batchProgress));
        }
        const resizeEndTime = performance.now();
        console.log(`리사이징 추출 시간: ${(resizeEndTime - resizeStartTime).toFixed(2)}ms`);

        return resizedImages;
    };

    const uploadImages = async (images: ImageModel[]) => {
        if (!tripId || !images.length) {
            return;
        }
        // const resizedImages = images;
        const resizedImages = await resizeImage(images);

        const files = resizedImages.map((image) => ({
            fileName: image.image.name,
            fileType: image.image.type,
        }));
        console.time(`Presigned 요청 시간`);
        const presignedUrls = await tripImageAPI.requestPresignedUploadUrls(tripId, files);
        console.timeEnd(`Presigned 요청 시간`);

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

        console.log(uploadedFiles);

        console.time(`서버 데이터 전송 시간`);
        await tripImageAPI.registerTripMediaFiles(tripId, uploadedFiles);
        console.timeEnd(`서버 데이터 전송 시간`);
    };

    return {
        tripId,
        imageCount,
        imagesWithLocationAndDate,
        imagesNoLocationWithDate,
        imagesNoDate,
        isExtracting,
        isAlertModalOpen,
        isAddLocationModalOpen,
        setIsAlertModalModalOpen,
        handleImageProcess,
        setIsAddLocationModalOpen,
        uploadImages,
    };
};

interface PresignedUrlResponse {
    fileKey: string;
    presignedPutUrl: string;
}
