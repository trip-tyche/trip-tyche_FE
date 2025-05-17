import { useState } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import { DEFAULT_METADATA } from '@/domains/media/constants';
import { PresignedUrlResponse, ImagesFiles, ImageFile } from '@/domains/media/types';
import { mediaAPI } from '@/libs/apis';
import { toResult } from '@/libs/apis/shared/utils';
import {
    completeImages,
    extractMetadataFromImage,
    imagesWithoutDate,
    imagesWithoutLocation,
    removeDuplicateImages,
    resizeImages,
} from '@/libs/utils/image';

export const useImageUpload = () => {
    const [images, setImages] = useState<ImagesFiles>();
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const { tripKey } = useParams();
    const [searchParams] = useSearchParams();

    const isEdit = searchParams.get('edit') !== null;

    const extractMetaData = async (images: FileList) => {
        const uniqueImages = removeDuplicateImages(images);

        setIsProcessing(true);
        console.time(`extract metadata`);
        const imagesWithMetadata = await extractMetadataFromImage(uniqueImages);
        console.timeEnd(`extract metadata`);

        optimizeImages(imagesWithMetadata);
    };

    const optimizeImages = async (images: ImageFile[]) => {
        console.time(`resize and convert to WebP`);
        const resizedImages = await resizeImages(images, setProgress);
        console.timeEnd(`resize convert to WebP`);

        setImages({
            totalImages: resizedImages,
            completeImages: completeImages(resizedImages),
            imagesWithoutDate: imagesWithoutDate(resizedImages),
            imagesWithoutLocation: imagesWithoutLocation(resizedImages),
        });

        setIsProcessing(false);
        uploadImagesToS3(images);
    };

    const uploadImagesToS3 = async (images: ImageFile[]) => {
        try {
            const imageNames = images.map((image) => ({ fileName: image.image.name }));
            const result = await mediaAPI.requestPresignedUrls(tripKey!, imageNames);
            if (!result.success) throw new Error(result.error);

            const { data: presignedUrls } = result;

            console.time(`image upload to S3`);
            await Promise.all(
                presignedUrls.map((urlInfo: PresignedUrlResponse, index: number) =>
                    mediaAPI.uploadToS3(urlInfo.presignedPutUrl, images[index].image),
                ),
            );
            console.timeEnd(`image upload to S3`);

            submitS3urlAndMetadata(images, presignedUrls);
        } catch (error) {
            console.error(error);
        }
    };

    const submitS3urlAndMetadata = async (images: ImageFile[], presignedUrls: PresignedUrlResponse[]) => {
        const metaDatas = presignedUrls.map((url: PresignedUrlResponse, index: number) => {
            const { recordDate, location } = images[index];
            return {
                mediaLink: url.presignedPutUrl.split('?')[0],
                latitude: location?.latitude || DEFAULT_METADATA.LOCATION,
                longitude: location?.longitude || DEFAULT_METADATA.LOCATION,
                recordDate: recordDate || DEFAULT_METADATA.DATE,
            };
        });

        console.time(`send metadata to server`);
        await mediaAPI.createMediaFileMetadata(tripKey!, metaDatas);
        console.timeEnd(`send metadata to server`);

        if (!isEdit) {
            const result = await toResult(async () => await mediaAPI.updateTripStatusToImagesUploaded(tripKey!));
            if (!result.success) throw Error(result.error);
        }
    };

    const uploadImages = async () => {
        const imagesToUpload = images?.totalImages;
        if (!tripKey || !imagesToUpload) {
            return;
        }
        try {
            const imageNames = imagesToUpload.map((image) => ({ fileName: image.image.name }));
            const result = await mediaAPI.requestPresignedUrls(tripKey, imageNames);
            if (!result.success) throw new Error(result.error);
            const { data: presignedUrls } = result;

            console.time(`image upload to S3`);
            await Promise.all(
                presignedUrls.map((urlInfo: PresignedUrlResponse, index: number) =>
                    mediaAPI.uploadToS3(urlInfo.presignedPutUrl, imagesToUpload[index].image),
                ),
            );
            console.timeEnd(`image upload to S3`);

            const metaDatas = presignedUrls.map((urlInfo: PresignedUrlResponse, index: number) => {
                const { recordDate, location } = imagesToUpload[index];
                return {
                    mediaLink: urlInfo.presignedPutUrl.split('?')[0],
                    latitude: location?.latitude || 0,
                    longitude: location?.longitude || 0,
                    recordDate: recordDate || '1980-01-01T00:00:00',
                };
            });

            console.time(`send metadata to server`);
            await mediaAPI.createMediaFileMetadata(tripKey, metaDatas);
            console.timeEnd(`send metadata to server`);

            if (!isEdit) {
                const result = await toResult(async () => await mediaAPI.updateTripStatusToImagesUploaded(tripKey));
                if (!result.success) throw Error(result.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return {
        images,
        progress,
        isProcessing,
        extractMetaData,
        uploadImages,
    };
};
