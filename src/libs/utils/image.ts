import { Dispatch, SetStateAction } from 'react';

import imageCompression from 'browser-image-compression';

import { COMPRESSION_OPTIONS } from '@/domains/media/constants';
import { ImageFile } from '@/domains/media/types';
import { formatToISOLocal } from '@/libs/utils/date';
import { extractDateFromImage, extractLocationFromImage } from '@/libs/utils/exif';
import { hasValidLocation } from '@/libs/utils/validate';

// 중복 이미지 제거
export const removeDuplicateImages = (images: FileList): FileList => {
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

export const extractMetadataFromImage = async (images: FileList | null): Promise<ImageFile[]> => {
    if (!images || images.length === 0) {
        return [];
    }

    return await Promise.all(
        Array.from(images).map(async (image) => {
            const location = await extractLocationFromImage(image);
            const date = await extractDateFromImage(image);

            return {
                image,
                recordDate: formatToISOLocal(date),
                location,
            };
        }),
    );
};

// 이미지 리사이징
export const resizeImages = async (
    images: ImageFile[] | null,
    onProgress?: Dispatch<SetStateAction<{ metadata: number; optimize: number; upload: number }>>,
): Promise<ImageFile[]> => {
    if (!images || images.length === 0) return [];

    const BATCH_SIZE = 10;
    const resizedImages: ImageFile[] = [];
    const totalImages = images.length;
    let processedImages = 0;

    for (let i = 0; i < images.length; i += BATCH_SIZE) {
        const batch = images.slice(i, i + BATCH_SIZE);

        const batchResult = await Promise.all(
            batch.map(async (image: ImageFile) => {
                try {
                    const resizedBlob = await imageCompression(image.image, COMPRESSION_OPTIONS);
                    const resizedFile = new File([resizedBlob], image.image.name.replace(/\.[^/.]+$/, '.webp'), {
                        type: COMPRESSION_OPTIONS.fileType,
                        lastModified: image.image.lastModified,
                    });
                    URL.revokeObjectURL(URL.createObjectURL(resizedBlob));

                    processedImages++;
                    if (onProgress) {
                        const progressPercent = Math.round((processedImages / totalImages) * 100);
                        onProgress((prev) => ({
                            ...prev,
                            optimize: progressPercent,
                        }));
                    }

                    return {
                        image: resizedFile,
                        recordDate: image.recordDate,
                        location: image.location,
                    };
                } catch (error) {
                    processedImages++;
                    if (onProgress) {
                        const progressPercent = Math.round((processedImages / totalImages) * 100);
                        onProgress((prev) => ({
                            ...prev,
                            optimize: progressPercent,
                        }));
                    }
                    return image;
                }
            }),
        );
        resizedImages.push(...batchResult);
    }

    return resizedImages;
};

// 위치, 날짜 모두 존재하는 이미지
export const completeImages = (metadatas: ImageFile[]) =>
    metadatas.filter((metadata) => metadata.recordDate && hasValidLocation(metadata.location));

// 위치 없는 이미지 (날짜만 존재)
export const imagesWithoutLocation = (metadatas: ImageFile[]) =>
    metadatas.filter((metadata) => metadata.recordDate && !hasValidLocation(metadata.location));

// 날짜 없는 이미지 (위치만 존재)
export const imagesWithoutDate = (metadatas: ImageFile[]) => metadatas.filter((metadata) => !metadata.recordDate);
