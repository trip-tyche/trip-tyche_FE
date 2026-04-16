import { useState } from 'react';

import { useParams } from 'react-router-dom';

import { DEFAULT_METADATA } from '@/domains/media/constants';
import {
    PresignedUrlResponse,
    ClientImageFile,
    ImageProcessStatusType,
    MediaFileCategories,
} from '@/domains/media/types';
import { filterWithoutDateMediaFile, filterWithoutLocationMediaFile } from '@/domains/media/utils';
import { mediaAPI } from '@/libs/apis';
import { convertHeicToJpg, extractMetadataFromImage, removeDuplicateImages } from '@/libs/utils/image';

const getProgressPercent = (process: number, total: number) => Math.round((process / total) * 100);

export const useImageUpload = () => {
    const [images, setImages] = useState<ClientImageFile[]>();
    const [imageCategories, setImageCategories] = useState<MediaFileCategories>();
    const [currentProcess, setCurrentProcess] = useState<ImageProcessStatusType>('metadata');
    const [progress, setProgress] = useState({
        metadata: 0,
        upload: 0,
    });

    const { tripKey } = useParams();

    const extractMetaData = async (images: FileList): Promise<FileList> => {
        setCurrentProcess('metadata');
        const imagesWithoutHeic = await convertHeicToJpg(images);
        const uniqueImages = removeDuplicateImages(imagesWithoutHeic);
        return uniqueImages;
    };

    const uploadImagesToS3 = async (uniqueFiles: FileList) => {
        setCurrentProcess('upload');
        try {
            const fileArray = Array.from(uniqueFiles);
            const imageNames = fileArray.map((file) => ({ fileName: file.name }));

            const [imagesWithMetadata, presignedResult] = await Promise.all([
                extractMetadataFromImage(uniqueFiles, setProgress),
                mediaAPI.requestPresignedUrls(tripKey!, imageNames),
            ]);

            if (!presignedResult.success) throw new Error(presignedResult.error);
            const presignedUrls = presignedResult.data;

            setImages(imagesWithMetadata);
            setImageCategories({
                withAll: { count: imagesWithMetadata.length || 0 },
                withoutLocation: { count: filterWithoutLocationMediaFile(imagesWithMetadata).length || 0 },
                withoutDate: { count: filterWithoutDateMediaFile(imagesWithMetadata).length || 0 },
            });

            let process = 0;
            await Promise.all(
                presignedUrls.map(async (urlInfo: PresignedUrlResponse, index: number) => {
                    const originalFile = fileArray[index];
                    await mediaAPI.uploadToS3(urlInfo.presignedPutUrl, originalFile);
                    const progressPercent = getProgressPercent(process++, fileArray.length);
                    setProgress((prev) => ({ ...prev, upload: progressPercent }));
                }),
            );

            await submitMetadata(imagesWithMetadata, presignedUrls);
        } catch {
            // presigned URL 요청 실패 시 사용자에게 에러 메시지가 Result 패턴으로 전달됨
        }
    };

    const submitMetadata = async (images: ClientImageFile[], presignedUrls: PresignedUrlResponse[]) => {
        const metaDatas = presignedUrls.map((url: PresignedUrlResponse, index: number) => {
            const { recordDate, latitude, longitude } = images[index];
            return {
                fileKey: url.fileKey,
                latitude: latitude || DEFAULT_METADATA.LOCATION,
                longitude: longitude || DEFAULT_METADATA.LOCATION,
                recordDate: recordDate || DEFAULT_METADATA.DATE,
            };
        });
        await mediaAPI.createMediaFileMetadata(tripKey!, metaDatas);
    };

    return {
        images,
        imageCategories,
        currentProcess,
        progress,
        extractMetaData,
        uploadImagesToS3,
    };
};
