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

export const resizeImages = async (images: ImageFile[] | null): Promise<ImageFile[]> => {
    if (!images || images.length === 0) return [];

    const resizedImages: ImageFile[] = [];
    const batchSize = 10;

    for (let i = 0; i < images.length; i += batchSize) {
        const batch = images.slice(i, i + batchSize);

        const batchResults = await Promise.all(
            batch.map(async (extractedImage: ImageFile) => {
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
                        recordDate: extractedImage.recordDate,
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

// 위치, 날짜 모두 존재하는 이미지
export const completeImages = (metadatas: ImageFile[]) =>
    metadatas.filter((metadata) => metadata.recordDate && hasValidLocation(metadata.location));

// 위치 없는 이미지 (날짜만 존재)
export const imagesWithoutLocation = (metadatas: ImageFile[]) =>
    metadatas.filter((metadata) => metadata.recordDate && !hasValidLocation(metadata.location));

// 날짜 없는 이미지 (위치만 존재)
export const imagesWithoutDate = (metadatas: ImageFile[]) => metadatas.filter((metadata) => !metadata.recordDate);
