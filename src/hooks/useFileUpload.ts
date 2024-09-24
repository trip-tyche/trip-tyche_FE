import { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { postTripImages } from '@/api/trip';
import { PATH } from '@/constants/path';
import { ImageWithLocation } from '@/types/image';
import { getImageLocation } from '@/utils/piexif';

export const useFileUpload = () => {
    const [imagesWithLocation, setImagesWithLocation] = useState<ImageWithLocation[]>([]);
    const [imagesNoLocation, setImagesNoLocation] = useState<File[]>([]);

    const navigate = useNavigate();
    const location = useLocation();

    const { tripId } = location.state;

    const handleFileUpload = async (files: FileList | null) => {
        if (!files) {
            return;
        }

        try {
            const processedImages = await Promise.all(
                Array.from(files).map(async (file) => {
                    const location = await getImageLocation(file);
                    // console.log(`Location for ${file.name}:`, location);
                    return { file, location };
                }),
            );
            // 위치 정보가 없는 이미지
            const noLocationImages = processedImages.filter((image) => !image.location).map((image) => image.file);
            setImagesNoLocation(noLocationImages);

            // 위치 정보가 있는 이미지
            const filteredImages = processedImages.filter((image) => image.location);
            setImagesWithLocation(filteredImages);
            console.log('Filtered images:', filteredImages);
        } catch (error) {
            console.error('Error processing files:', error);
        }
    };

    const uploadTripImages = async () => {
        try {
            const images = imagesWithLocation.map((image) => image.file);

            await postTripImages(tripId, images);
            navigate(PATH.TRIP_LIST);
        } catch (error) {
            console.error('Error post trip-images:', error);
        }
    };

    return {
        imagesWithLocation,
        imagesNoLocation,
        handleFileUpload,
        uploadTripImages,
    };
};
