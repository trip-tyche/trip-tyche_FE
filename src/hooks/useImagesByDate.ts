import { useEffect, useState } from 'react';

import { tripImageAPI } from '@/api';
import { LatLng } from '@/types/maps';
import { MediaFileModel } from '@/types/media';

export const useImagesByDate = (tripId: string, currentDate: string) => {
    const [imagesByDate, setImagesByDate] = useState<MediaFileModel[]>([]);
    const [imageLocation, setImageLocation] = useState<LatLng>();

    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [loadedImageCount, setLoadedImageCount] = useState(0);

    useEffect(() => {
        const getImagesByDate = async () => {
            if (!(tripId && currentDate)) {
                return;
            }
            setLoadedImageCount(0);
            setIsImageLoaded(false);
            const { imagesLink } = await tripImageAPI.fetchImagesByDate(tripId, currentDate);
            setImagesByDate(imagesLink || []);

            if (imagesLink && imagesLink.length > 0) {
                setImageLocation({ lat: imagesLink[0].latitude, lng: imagesLink[0].longitude });
            }
        };

        getImagesByDate();
    }, [tripId, currentDate]);

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
