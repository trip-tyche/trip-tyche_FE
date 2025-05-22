import { Dispatch, SetStateAction } from 'react';

import imageCompression from 'browser-image-compression';

import { COMPRESSION_OPTIONS, MEDIA_FORMAT } from '@/domains/media/constants';
import { ClientImageFile } from '@/domains/media/types';
import { formatToISOLocal } from '@/libs/utils/date';
import { extractDateFromImage, extractLocationFromImage } from '@/libs/utils/exif';

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
): Promise<ClientImageFile[]> => {
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
                latitude: location?.latitude || 0,
                longitude: location?.longitude || 0,
            };
        }),
    );
};

// 이미지 리사이징
export const resizeImages = async (
    images: ClientImageFile[],
    onProgress?: Dispatch<SetStateAction<{ metadata: number; optimize: number; upload: number }>>,
): Promise<ClientImageFile[]> => {
    if (images.length === 0) return [];

    const totalImages = images.length;
    let process = 0;
    const promise = await Promise.all(
        images.map(async (image: ClientImageFile) => {
            try {
                const resizedBlob = await imageCompression(image.image, COMPRESSION_OPTIONS);
                const resizedFile = new File(
                    [resizedBlob],
                    image.image.name.replace(MEDIA_FORMAT.CURRENT_MEDIA_FORMAT, MEDIA_FORMAT.WEBP_FORMAT),
                );
                return {
                    ...image,
                    image: resizedFile,
                };
            } catch (error) {
                return image;
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
// export const completeImages = (metadatas: ClientImageFile[] | MediaFile[]) =>
//     metadatas.filter((metadata) => metadata.recordDate && hasValidLocation(metadata.location));

/**
 * 기본 위치{latitude: 0, longtitude: 0}가 아닌 유효한 위치를 가진 미디어 파일만 필터링
 * @param mediaFiles 필터링할 미디어 파일 배열
 * @returns 유효한 위치를 가진 미디어 파일 배열
 */
// export const imagesWithoutLocation = (metadatas: ClientImageFile[] | MediaFile[]) =>
//     metadatas.filter((metadata) => !hasValidLocation(metadata.location));
// /**
//  * 기본 날짜(1980-01-01)가 아닌 유효한 날짜를 가진 미디어 파일만 필터링
//  * @param mediaFiles 필터링할 미디어 파일 배열
//  * @returns 유효한 날짜를 가진 미디어 파일 배열
//  */
// export const imagesWithoutDate = (metadatas: ClientImageFile[] | MediaFile[]) =>
//     metadatas.filter((metadata) => !hasValidDate(metadata.recordDate));
