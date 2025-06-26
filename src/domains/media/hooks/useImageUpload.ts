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
import { convertHeicToJpg, extractMetadataFromImage, removeDuplicateImages, resizeImages } from '@/libs/utils/image';

const getProgressPercent = (process: number, total: number) => Math.round((process / total) * 100);

export const useImageUpload = () => {
    const [images, setImages] = useState<ClientImageFile[]>();
    const [imageCategories, setImageCategories] = useState<MediaFileCategories>();
    const [currentProcess, setCurrentProcess] = useState<ImageProcessStatusType>('metadata');
    const [progress, setProgress] = useState({
        metadata: 0,
        optimize: 0,
        upload: 0,
    });

    const { tripKey } = useParams();

    const extractMetaData = async (images: FileList) => {
        setCurrentProcess('metadata');
        const imagesWithoutHeic = await convertHeicToJpg(images);
        const uniqueImages = removeDuplicateImages(imagesWithoutHeic);

        const imagesWithMetadata = await extractMetadataFromImage(uniqueImages, setProgress);

        return imagesWithMetadata;
    };

    const optimizeImages = async (images: ClientImageFile[]) => {
        setCurrentProcess('optimize');
        const optimizedImages = await resizeImages(images, setProgress);

        setImages(optimizedImages);

        setImageCategories({
            withAll: { count: optimizedImages.length || 0 },
            withoutLocation: { count: filterWithoutLocationMediaFile(optimizedImages).length || 0 },
            withoutDate: { count: filterWithoutDateMediaFile(optimizedImages).length || 0 },
        });

        return optimizedImages;
    };

    const uploadImagesToS3 = async (images: ClientImageFile[]) => {
        setCurrentProcess('upload');
        try {
            const imageNames = images.map((image) => ({ fileName: image.image.name }));
            const result = await mediaAPI.requestPresignedUrls(tripKey!, imageNames);
            if (!result.success) throw new Error(result.error);
            const { data: presignedUrls } = result;

            let process = 0;
            await Promise.all(
                presignedUrls.map(async (urlInfo: PresignedUrlResponse, index: number) => {
                    const result = await mediaAPI.uploadToS3(urlInfo.presignedPutUrl, images[index].image);
                    const progressPercent = getProgressPercent(process++, images.length);
                    setProgress((prev) => ({ ...prev, upload: progressPercent }));
                    return result;
                }),
            );
            submitS3urlAndMetadata(images, presignedUrls);
        } catch (error) {
            console.error(error);
        }
    };

    const submitS3urlAndMetadata = async (images: ClientImageFile[], presignedUrls: PresignedUrlResponse[]) => {
        const metaDatas = presignedUrls.map((url: PresignedUrlResponse, index: number) => {
            const { recordDate, latitude, longitude } = images[index];
            return {
                mediaLink: url.presignedPutUrl.split('?')[0],
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
        optimizeImages,
        uploadImagesToS3,
    };
};
