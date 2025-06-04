import { Dispatch, SetStateAction } from 'react';

import imageCompression from 'browser-image-compression';
import heic2any from 'heic2any';

import { COMPRESSION_OPTIONS, MEDIA_FORMAT } from '@/domains/media/constants';
import { ClientImageFile } from '@/domains/media/types';
import { formatToISOLocal } from '@/libs/utils/date';
import { extractDateFromImage, extractLocationFromImage } from '@/libs/utils/exif';

// 중복 이미지 제거
export const removeDuplicateImages = (images: File[]): FileList => {
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

// 이미지 메타데이터 추출
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
                    { type: 'image/webp' },
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

// Heic -> jpeg 확장자 변경
export const convertHeicToJpg = async (images: FileList) => {
    const convertedImages = await Promise.all(
        Array.from(images).map(async (image) => {
            const actualType = await getActualFileType(image);
            if (actualType === 'image/heic') {
                const convertedBlob = await heic2any({
                    blob: image,
                    toType: 'image/jpeg',
                });
                const convertedFile = new File(
                    [convertedBlob as Blob],
                    image.name.replace(MEDIA_FORMAT.CURRENT_MEDIA_FORMAT, MEDIA_FORMAT.JPG_FORMAT),
                    { type: 'image/jpeg' },
                );
                return convertedFile;
            } else {
                return image;
            }
        }),
    );

    return convertedImages;
};

// 이미지 실제 타입 반환
const getActualFileType = async (file: File): Promise<string> => {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (bytes.length >= 12) {
        const ftyp = String.fromCharCode(...bytes.slice(4, 8));
        if (ftyp === 'ftyp') {
            const brand = String.fromCharCode(...bytes.slice(8, 12));
            if (brand === 'heic' || brand === 'mif1' || brand === 'msf1') {
                return 'image/heic';
            }
        }
    }

    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
        return 'image/jpeg';
    }

    return file.type;
};
