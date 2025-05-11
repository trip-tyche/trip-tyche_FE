import { useState } from 'react';

import { useParams } from 'react-router-dom';

import { PresignedUrlResponse } from '@/domains/media/image';
import { ImageFile, ImagesFiles } from '@/domains/media/types';
import { mediaAPI } from '@/libs/apis';
import {
    completeImages,
    extractMetadataFromImage,
    imagesWithoutDate,
    imagesWithoutLocation,
    removeDuplicateImages,
    resizeImages,
} from '@/libs/utils/image';
import { useUploadStatusStore } from '@/shared/stores/useUploadStatusStore';

export const useImageUpload = () => {
    const [images, setImages] = useState<ImagesFiles>();
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const setUploadStatus = useUploadStatusStore((state) => state.setUploadStatus);

    const { tripKey } = useParams();

    const extractMetaDataAndResizeImages = async (images: FileList | null) => {
        if (!images) return;
        const uniqueImages = removeDuplicateImages(images);

        setIsProcessing(true);
        console.time(`extract metadata and resize`);
        const metadatas = await extractMetadataFromImage(uniqueImages);
        console.log(metadatas);
        const resizedImages = await resizeImages(metadatas, setProgress);
        console.timeEnd(`extract metadata and resize`);

        setImages({
            totalImages: resizedImages,
            completeImages: completeImages(resizedImages),
            imagesWithoutDate: imagesWithoutDate(resizedImages),
            imagesWithoutLocation: imagesWithoutLocation(resizedImages),
        });

        setIsProcessing(false);
    };

    const uploadImages = async (imagesToUpload: ImageFile[]) => {
        if (!tripKey || !imagesToUpload.length) {
            return;
        }

        try {
            setUploadStatus('pending');

            if (!images?.totalImages) return;

            const imageNames = images?.totalImages.map((image) => ({ fileName: image.image.name }));
            const result = await mediaAPI.requestPresignedUrls(tripKey, imageNames);
            if (!result.success) throw new Error(result.error);
            const { data: presignedUrls } = result;

            console.time(`image upload to S3`);
            await Promise.all(
                presignedUrls.map((urlInfo: PresignedUrlResponse, index: number) =>
                    mediaAPI.uploadToS3(urlInfo.presignedPutUrl, images?.totalImages[index].image),
                ),
            );
            console.timeEnd(`image upload to S3`);

            const metaDatas = presignedUrls.map((urlInfo: PresignedUrlResponse, index: number) => {
                const { recordDate, location } = images.totalImages[index];
                return {
                    mediaLink: urlInfo.presignedPutUrl.split('?')[0],
                    latitude: location?.latitude || 0,
                    longitude: location?.longitude || 0,
                    recordDate,
                };
            });

            console.time(`send metadata to server`);
            await mediaAPI.createMediaFileMetadata(tripKey, metaDatas);
            console.timeEnd(`send metadata to server`);

            setUploadStatus('completed');
        } catch (error) {
            console.error(error);
            setUploadStatus('error');
        }
    };

    return {
        images,
        progress,
        isProcessing,
        extractMetaDataAndResizeImages,
        uploadImages,
    };
};
