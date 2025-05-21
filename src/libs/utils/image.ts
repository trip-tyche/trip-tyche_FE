import { Dispatch, SetStateAction } from 'react';

import imageCompression from 'browser-image-compression';

import { COMPRESSION_OPTIONS, MEDIA_FORMAT } from '@/domains/media/constants';
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

export const extractMetadataFromImage = async (
    images: FileList,
    onProgress?: Dispatch<SetStateAction<{ metadata: number; optimize: number; upload: number }>>,
): Promise<ImageFile[]> => {
    if (images.length === 0) return [];

    let process = 0;

    return await Promise.all(
        Array.from(images).map(async (image) => {
            const location = await extractLocationFromImage(image);
            const date = await extractDateFromImage(image);

            process++;

            if (onProgress) {
                const progressPercent = Math.round((process / images.length) * 100);
                onProgress((prev) => ({
                    ...prev,
                    metadata: progressPercent,
                }));
            }

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
    images: ImageFile[],
    onProgress?: Dispatch<SetStateAction<{ metadata: number; optimize: number; upload: number }>>,
): Promise<ImageFile[]> => {
    if (images.length === 0) return [];

    const totalImages = images.length;
    let process = 0;
    const promise = await Promise.all(
        images.map(async (image: ImageFile) => {
            try {
                const resizedBlob = await imageCompression(image.image, COMPRESSION_OPTIONS);
                const resizedFile = new File(
                    [resizedBlob],
                    image.image.name.replace(MEDIA_FORMAT.CURRENT_MEDIA_FORMAT, MEDIA_FORMAT.WEBP_FORMAT),
                );
                return {
                    image: resizedFile,
                    recordDate: image.recordDate,
                    location: image.location,
                };
            } catch (error) {
                return { image: image.image, recordDate: image.recordDate, location: image.location };
            } finally {
                process++;
                if (onProgress) {
                    const progressPercent = Math.round((process / totalImages) * 100);
                    onProgress((prev) => ({
                        ...prev,
                        optimize: progressPercent,
                    }));
                }
            }
        }),
    );

    return promise;
};

// 위치, 날짜 모두 존재하는 이미지
export const completeImages = (metadatas: ImageFile[]) =>
    metadatas.filter((metadata) => metadata.recordDate && hasValidLocation(metadata.location));

// 위치 없는 이미지 (날짜만 존재)
export const imagesWithoutLocation = (metadatas: ImageFile[]) =>
    metadatas.filter((metadata) => !hasValidLocation(metadata.location));

// 날짜 없는 이미지 (위치만 존재)
export const imagesWithoutDate = (metadatas: ImageFile[]) => metadatas.filter((metadata) => !metadata.recordDate);
