import { useState } from 'react';

import { useMediaByDate } from '@/domains/media/hooks/queries';
import { LatLng } from '@/shared/types/map';

export const useImagesByDate = (tripKey: string, currentDate: string) => {
    // const [imagesByDate, setImagesByDate] = useState<MediaFileModel[]>([]);
    const [imageLocation, setImageLocation] = useState<LatLng>();

    // const [isImageLoaded, setIsImageLoaded] = useState(false);
    // const [loadedImageCount, setLoadedImageCount] = useState(0);

    const { data: result } = useMediaByDate(tripKey, currentDate);

    if (!result) return;
    if (!result.success) {
        return;
    }

    // useEffect(() => {
    //     const getImagesByDate = async () => {
    //         if (!(tripKey && currentDate)) {
    //             return;
    //         }
    //         setLoadedImageCount(0);
    //         setIsImageLoaded(false);

    //         const result = await mediaAPI.fetchImagesByDate(tripKey, currentDate);
    //         const { mediaFiles: images } = result;

    //         const validLocationImages = images.filter(
    //             (image: MediaFileModel) => image.latitude !== 0 && image.longitude !== 0,
    //         );

    //         setImagesByDate(validLocationImages || []);

    //         if (images && images.length > 0) {
    //             setImageLocation({ lat: images[0].latitude, lng: images[0].longitude });
    //         }
    //     };

    //     getImagesByDate();
    // }, [tripKey, currentDate]);

    // useEffect(() => {
    //     if (loadedImageCount === imagesByDate.length) {
    //         setIsImageLoaded(true);
    //     }
    // }, [loadedImageCount, imagesByDate]);

    // const handleImageLoad = () => {
    //     setLoadedImageCount((prev) => {
    //         const loadedImageCount = prev + 1;
    //         return loadedImageCount;
    //     });
    // };

    return {
        images: result.data,
        imageLocation,
        // isImageLoaded,
        setImageLocation,
        // handleImageLoad,
    };
};
