import { useEffect, useState } from 'react';

import { mediaAPI } from '@/api';
import { MediaFileModel } from '@/domain/media/types';
import { LatLng } from '@/types/maps';

export const useImagesByDate = (tripKey: string, currentDate: string) => {
    const [imagesByDate, setImagesByDate] = useState<MediaFileModel[]>([]);
    const [imageLocation, setImageLocation] = useState<LatLng>();

    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [loadedImageCount, setLoadedImageCount] = useState(0);

    useEffect(() => {
        const getImagesByDate = async () => {
            if (!(tripKey && currentDate)) {
                return;
            }
            setLoadedImageCount(0);
            setIsImageLoaded(false);

            const result = await mediaAPI.fetchImagesByDate(tripKey, currentDate);
            const { mediaFiles: images } = result;

            const validLocationImages = images.filter(
                (image: MediaFileModel) => image.latitude !== 0 && image.longitude !== 0,
            );

            setImagesByDate(validLocationImages || []);

            if (images && images.length > 0) {
                setImageLocation({ lat: images[0].latitude, lng: images[0].longitude });
            }
        };

        getImagesByDate();
    }, [tripKey, currentDate]);

    useEffect(() => {
        if (loadedImageCount === imagesByDate.length) {
            setIsImageLoaded(true);
        }
    }, [loadedImageCount, imagesByDate]);

    const handleImageLoad = () => {
        setLoadedImageCount((prev) => {
            const loadedImageCount = prev + 1;
            return loadedImageCount;
        });
    };

    return {
        imagesByDate,
        imageLocation,
        isImageLoaded,
        setImageLocation,
        handleImageLoad,
    };
};
