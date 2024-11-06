import { useState } from 'react';

import imageCompression from 'browser-image-compression';
import { useNavigate, useParams } from 'react-router-dom';

import { postTripImages } from '@/api/trip';
import { PATH } from '@/constants/path';
import { useToastStore } from '@/stores/useToastStore';
import { useUploadStore } from '@/stores/useUploadingStore';
import { ImageModel } from '@/types/image';
import { formatDateToYYYYMMDD } from '@/utils/date';
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

    const showToast = useToastStore((state) => state.showToast);
    const setUploadStatus = useUploadStore((state) => state.setUploadStatus);

    const navigate = useNavigate();
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

    // const resizeImage = async (extractedImages: ImageModel[] | null): Promise<ImageModel[]> => {
    //     if (!extractedImages || extractedImages.length === 0) {
    //         return [];
    //     }

    //     const compressionOptions = {
    //         maxWidthOrHeight: 1284,
    //         initialQuality: 0.8,
    //         useWebWorker: true,
    //         preserveExif: true,
    //         fileType: 'image/jpeg',
    //     };

    //     const resizeStartTime = performance.now();
    //     const resizedImages = await Promise.all(
    //         extractedImages.map(async (extractedImage: ImageModel) => {
    //             try {
    //                 const resizedBlob = await imageCompression(extractedImage.image, compressionOptions);

    //                 const resizedFile = new File([resizedBlob], extractedImage.image.name, {
    //                     type: compressionOptions.fileType,
    //                     lastModified: extractedImage.image.lastModified,
    //                 });

    //                 // 진행된 이미지 수 증가 및 진행률 계산
    //                 completedImages++;
    //                 const currentProgress = Math.round((completedImages / totalImages) * 100);
    //                 setResizingProgress(currentProgress);

    //                 // console.log(`${extractedImage.image.name} 변환 결과:`, {
    //                 //     originalSize: `${(extractedImage.image.size / (1024 * 1024)).toFixed(2)}MB`,
    //                 //     convertedSize: `${(resizedBlob.size / (1024 * 1024)).toFixed(2)}MB`,
    //                 //     format: compressionOptions.fileType,
    //                 // });

    //                 return {
    //                     image: resizedFile,
    //                     formattedDate: extractedImage.formattedDate,
    //                     location: extractedImage.location,
    //                 };
    //             } catch (error) {
    //                 completedImages++; // 에러 시에도 진행 수 증가
    //                 const currentProgress = Math.round((completedImages / totalImages) * 100);
    //                 setResizingProgress(currentProgress);
    //                 return extractedImage;
    //                 // console.error(`리사이징에 실패한 이미지: ${extractedImage.image.name}`, error);
    //             }
    //         }),
    //     );

    //     const resizeEndTime = performance.now();
    //     console.log(`리사이징 시간: ${(resizeEndTime - resizeStartTime).toFixed(2)}ms`);

    //     return resizedImages;
    // };
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

            const imagesWithLocationAndDate = extractedImages.filter((image) => image.location && image.formattedDate);
            const imagesNoLocationWithDate = extractedImages.filter((image) => !image.location && image.formattedDate);
            const imagesNoDate = extractedImages.filter((image) => !image.formattedDate);

            setImagesCount(images.length);
            setImagesWithLocationAndDate(imagesWithLocationAndDate);
            setImagesNoLocationWithDate(imagesNoLocationWithDate);
            setImagesNoDate(imagesNoDate);
            setIsAlertModalModalOpen(true);

            if (!imagesWithLocationAndDate.length && !imagesNoLocationWithDate.length) {
                return;
            }

            // setIsResizing(true);
            // setResizingProgress(0); // 진행률 초기화
            // completedImages = 0; // 완료 이미지 수 초기화

            // // 전체 이미지 개수 계산
            // totalImages = (imagesWithLocationAndDate?.length || 0) + (imagesNoLocationWithDate?.length || 0);

            // const [resizedImagesWithLocationAndDate, resizedImagesNoLocationWithDate] = await Promise.all([
            //     resizeImage(imagesWithLocationAndDate),
            //     resizeImage(imagesNoLocationWithDate),
            // ]);
            // setIsResizing(false);
            // setResizingProgress(0); // 진행률 리셋

            // setImagesWithLocationAndDate(resizedImagesWithLocationAndDate);
            // setImagesNoLocationWithDate(resizedImagesNoLocationWithDate);

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

            console.log('위치 ✅ / 날짜 ✅:', imagesWithLocationAndDate);
            console.log('위치 ⛔️ / 날짜 ✅:', imagesNoLocationWithDate);
            console.log('날짜 ⛔️:', imagesNoDate);
        } catch (error) {
            console.error('이미지 처리 중 오류 발생', error);
            setIsExtracting(false);
            setIsResizing(false);
        }
    };

    const uploadImages = async (images: ImageModel[]) => {
        if (!tripId) {
            console.error('Trip ID가 필요합니다.');
            return;
        }

        setUploadStatus('pending');

        const imagesToUpload = images.map((image) => image.image);

        postTripImages(tripId, imagesToUpload)
            .then((message) => {
                console.log('이미지 업로드 완료:', message);
                setUploadStatus('completed');
            })
            .catch((error) => {
                setUploadStatus('error');
                showToast('다시 로그인해주세요.');
                navigate(PATH.LOGIN);
                localStorage.clear();
                console.error('이미지 업로드 중 오류 발생:', error);
                return;
            });
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
