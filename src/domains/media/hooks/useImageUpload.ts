import { useRef, useState } from 'react';

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

export const useImageUpload = () => {
    const [images, setImages] = useState<ClientImageFile[]>();
    const [imageCategories, setImageCategories] = useState<MediaFileCategories>();
    const [currentProcess, setCurrentProcess] = useState<ImageProcessStatusType>('metadata');
    const [progress, setProgress] = useState({
        metadata: 0,
        upload: 0,
    });
    const [backgroundUploadError, setBackgroundUploadError] = useState<Error | null>(null);
    const bgUploadPromiseRef = useRef<Promise<void> | null>(null);

    const { tripKey } = useParams();

    const extractMetaData = async (images: FileList): Promise<FileList> => {
        setCurrentProcess('metadata');
        const imagesWithoutHeic = await convertHeicToJpg(images);
        const uniqueImages = removeDuplicateImages(imagesWithoutHeic);
        return uniqueImages;
    };

    const uploadImagesToS3 = async (uniqueFiles: FileList) => {
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

            // 메타데이터를 백엔드에 즉시 전송 (fileKey + EXIF 데이터)
            await submitMetadata(imagesWithMetadata, presignedUrls);

            // S3 업로드는 백그라운드에서 실행 (사용자를 차단하지 않음)
            const rawUpload = Promise.all(
                presignedUrls.map((urlInfo: PresignedUrlResponse, index: number) =>
                    mediaAPI.uploadToS3(urlInfo.presignedPutUrl, fileArray[index]),
                ),
            ).then(() => {});
            bgUploadPromiseRef.current = rawUpload;
            rawUpload.catch((err: Error) => setBackgroundUploadError(err));
        } catch {
            // presigned URL 요청 또는 메타데이터 POST 실패
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

    const waitForBackgroundUpload = async () => {
        if (bgUploadPromiseRef.current) await bgUploadPromiseRef.current;
    };

    return {
        images,
        imageCategories,
        currentProcess,
        progress,
        backgroundUploadError,
        extractMetaData,
        uploadImagesToS3,
        waitForBackgroundUpload,
    };
};
