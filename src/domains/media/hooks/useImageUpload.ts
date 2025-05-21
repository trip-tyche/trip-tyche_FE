import { useState } from 'react';

import { useParams } from 'react-router-dom';

import { DEFAULT_METADATA } from '@/domains/media/constants';
import { PresignedUrlResponse, ImageFile, ImageProcessStatusType, ImageCount } from '@/domains/media/types';
import { mediaAPI } from '@/libs/apis';
import {
    extractMetadataFromImage,
    imagesWithoutDate,
    imagesWithoutLocation,
    removeDuplicateImages,
    resizeImages,
} from '@/libs/utils/image';

export const useImageUpload = () => {
    const [images, setImages] = useState<ImageFile[]>();
    const [imageCount, setImageCount] = useState<ImageCount>();
    const [currentProcess, setCurrentProcess] = useState<ImageProcessStatusType>('metadata');
    const [progress, setProgress] = useState({
        metadata: 0,
        optimize: 0,
        upload: 0,
    });

    const { tripKey } = useParams();

    const extractMetaData = async (images: FileList) => {
        setCurrentProcess('metadata');
        const uniqueImages = removeDuplicateImages(images);

        // console.time(`extract metadata`);
        const imagesWithMetadata = await extractMetadataFromImage(uniqueImages, setProgress);
        // console.timeEnd(`extract metadata`);

        return imagesWithMetadata;
    };

    const optimizeImages = async (images: ImageFile[]) => {
        setCurrentProcess('optimize');
        // console.time(`resize and convert to WebP`);
        const optimizedImages = await resizeImages(images, setProgress);
        // console.timeEnd(`resize and convert to WebP`);

        setImages(optimizedImages);

        // console.log('total: ', optimizedImages);
        // console.log('withoutDate: ', imagesWithoutDate(optimizedImages));
        // console.log('withoutLocation: ', imagesWithoutLocation(optimizedImages));

        setImageCount({
            total: optimizedImages.length || 0,
            withoutDate: imagesWithoutDate(optimizedImages).length || 0,
            withoutLocation: imagesWithoutLocation(optimizedImages).length || 0,
        });

        return optimizedImages;
    };

    const uploadImagesToS3 = async (images: ImageFile[]) => {
        setCurrentProcess('upload');
        try {
            const imageNames = images.map((image) => ({ fileName: image.image.name }));
            const result = await mediaAPI.requestPresignedUrls(tripKey!, imageNames);
            if (!result.success) throw new Error(result.error);

            const { data: presignedUrls } = result;

            // console.time(`image upload to S3`);

            let process = 0;

            await Promise.all(
                presignedUrls.map((urlInfo: PresignedUrlResponse, index: number) => {
                    process++;
                    const progressPercent = Math.round((process / images.length) * 100);
                    return mediaAPI.uploadToS3(urlInfo.presignedPutUrl, images[index].image, () => {
                        setProgress((prev) => ({
                            ...prev,
                            upload: progressPercent,
                        }));
                    });
                }),
            );
            // console.timeEnd(`image upload to S3`);

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

        // console.time(`send metadata to server`);
        await mediaAPI.createMediaFileMetadata(tripKey!, metaDatas);
        // console.timeEnd(`send metadata to server`);
    };

    return {
        images,
        imageCount,
        currentProcess,
        progress,
        extractMetaData,
        optimizeImages,
        uploadImagesToS3,
    };
};
