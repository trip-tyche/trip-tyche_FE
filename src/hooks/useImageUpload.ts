import { useState } from 'react';

import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';

import { postTripImages } from '@/api/trip';
import { PATH } from '@/constants/path';
// import { useToastStore } from '@/stores/useToastStore';
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
    // const { showToast } = useToastStore();

    const navigate = useNavigate();
    // const location = useLocation();

    // const { startDate, endDate } = location.state;

    // 압축 옵션 설정 함수
    const getCompressionOptions = () => ({
        maxWidthOrHeight: 846, // 원하는 너비
        initialQuality: 0.9, // 품질 설정
        useWebWorker: true, // WebWorker 사용
        preserveExif: true, // EXIF 데이터 보존
        fileType: 'image/jpeg',
    });

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

            // 이미지 리사이징
            const resizeStartTime = performance.now();
            const compressionOptions = getCompressionOptions();

            const finalProcessedImages = await Promise.all(
                processedImages.map(async (processedImage) => {
                    try {
                        const resizedBlob = await imageCompression(processedImage.file, compressionOptions);

                        // Blob을 File로 변환
                        const resizedFile = new File([resizedBlob], processedImage.file.name, {
                            type: compressionOptions.fileType,
                            lastModified: processedImage.file.lastModified,
                        });

                        console.log(`${processedImage.file.name} 변환 결과:`, {
                            originalSize: `${(processedImage.file.size / (1024 * 1024)).toFixed(2)}MB`,
                            convertedSize: `${(resizedFile.size / (1024 * 1024)).toFixed(2)}MB`,
                            format: compressionOptions.fileType,
                        });

                        return {
                            file: resizedFile,
                            formattedDate: processedImage.formattedDate,
                            location: processedImage.location,
                        };
                    } catch (error) {
                        console.error(`Error resizing image: ${processedImage.file.name}`, error);

                        try {
                            const jpegOptions = { ...compressionOptions, fileType: 'image/jpeg' };
                            const jpegBlob = await imageCompression(processedImage.file, jpegOptions);

                            // JPEG Blob을 File로 변환
                            const jpegFile = new File([jpegBlob], processedImage.file.name, {
                                type: 'image/jpeg',
                                lastModified: processedImage.file.lastModified,
                            });

                            return {
                                file: jpegFile,
                                formattedDate: processedImage.formattedDate,
                                location: processedImage.location,
                            };
                        } catch (jpegError) {
                            console.error('JPEG 변환도 실패:', jpegError);
                            return processedImage;
                        }
                    }
                }),
            );

            const resizeEndTime = performance.now();
            console.log(`총 ${files.length}개 이미지 리사이징 시간: ${(resizeEndTime - resizeStartTime).toFixed(2)}ms`);
            // console.log(`이미지 포맷: ${compressionOptions.fileType}`);

            // startDate와 endDate 사이에 있는 이미지만 필터링
            // const filteredImages = finalProcessedImages.filter((image) => {
            //     if (!image.formattedDate) return false;
            //     return image.formattedDate >= startDate && image.formattedDate <= endDate;
            // });

            // 위치와 날짜 모두 있는 이미지
            const imagesWithLocation = finalProcessedImages.filter((image) => image.location && image.formattedDate);

            const datesWithLocation = imagesWithLocation
                .filter((img) => img.formattedDate) // 날짜가 있는 이미지만 필터링
                .map((img) => img.formattedDate)
                .sort();

            if (datesWithLocation.length > 0) {
                const earliestDate = datesWithLocation[0];
                const latestDate = datesWithLocation[datesWithLocation.length - 1];
                console.log(`${earliestDate}~${latestDate}`);
                localStorage.setItem('earliest-date', earliestDate);
                localStorage.setItem('latest-date', latestDate);
            }

            setImagesWithLocation(imagesWithLocation);
            console.log('위치 ✅:', imagesWithLocation);

            // 위치 정보가 없는 이미지
            const noLocationImages = finalProcessedImages
                .filter((image) => !image.location && image.formattedDate)
                .map(({ file, formattedDate }) => ({
                    file,
                    formattedDate,
                }));

            setImagesNoLocation(noLocationImages);

            console.log('위치 ⛔️:', noLocationImages);

            // 날짜 정보가 없는 이미지 (startDate와 endDate 범위 밖의 이미지 포함)
            const noDateImages = processedImages.filter(
                (image) => !image.formattedDate,
                // image.formattedDate === '' || image.formattedDate < startDate || image.formattedDate > endDate,
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

            const tripId = localStorage.getItem('tripId');

            if (!tripId) {
                return;
            }

            // await postTripImages(tripId, images);
            // 비동기 업로드 시작, 결과를 기다리지 않음
            postTripImages(tripId, images)
                .catch((error) => {
                    console.error('Error post trip-images:', error);
                })
                .finally(() => {
                    setIsUploading(false);
                });

            if (imagesNoLocation.length) {
                setIsGuideModalOpen(true);
                return;
            }

            navigate(PATH.TRIP_NEW);
            // navigate(PATH.TRIP_LIST);
            // showToast('사진이 업로드되었습니다.');
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
