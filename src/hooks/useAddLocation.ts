import { useEffect, useState } from 'react';

import piexif from 'piexifjs';
import { useLocation, useNavigate } from 'react-router-dom';

import { postTripImages } from '@/api/trip';
import { PATH } from '@/constants/path';
import { createGpsExif, insertExifIntoJpeg, readFileAsDataURL } from '@/utils/piexif';

export const useAddLocation = () => {
    const [displayedImages, setDisplayedImages] = useState<File[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [updatedImages, setUpdatedImages] = useState<File[]>([]);

    const navigate = useNavigate();
    const location = useLocation();
    const { imagesNoLocation } = location.state;

    useEffect(() => {
        setDisplayedImages(imagesNoLocation);
    }, []);

    const toggleImageSelection = (image: File) => {
        setSelectedImages((prev) => {
            const isSelected = prev.some((file) => file.name === image.name);

            if (isSelected) {
                return prev.filter((file) => file.name !== image.name);
            } else {
                return [...prev, image];
            }
        });
    };

    const handleNextClick = () => {
        if (selectedImages.length > 0) {
            setShowMap(true);
        }
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedLocation({ lat, lng });
    };

    const handleSubmitClick = async () => {
        try {
            await postTripImages('1', updatedImages);
            navigate(PATH.TRIP_LIST);
        } catch (error) {
            console.error('Error post trip-images:', error);
        }
    };

    const handleConfirmLocation = async () => {
        if (!selectedLocation) {
            console.warn('Location is not selected.');
            return;
        }

        console.log('Selected images:', selectedImages);
        console.log('Selected location:', selectedLocation);

        const updatedImages = await Promise.all(
            selectedImages.map(async (image) => {
                const exifObj = piexif.load(await readFileAsDataURL(image));
                const gpsExif = createGpsExif(selectedLocation.lat, selectedLocation.lng);

                const newExif = { ...exifObj, ...gpsExif };
                const exifStr = piexif.dump(newExif);

                const newImageBlob = await insertExifIntoJpeg(image, exifStr);
                return new File([newImageBlob], image.name, { type: image.type });
            }),
        );

        setUpdatedImages(updatedImages);
        console.log('Images with updated location:', updatedImages);

        const updatedDisplayedImages = displayedImages.filter(
            (image) => !selectedImages.some((selected) => selected.name === image.name),
        );

        await postTripImages('1', updatedImages);

        if (updatedDisplayedImages.length === 0) {
            navigate(PATH.TRIP_LIST);
            return;
        }

        setDisplayedImages(updatedDisplayedImages);
        setSelectedImages([]);

        setShowMap(false);
    };

    return {
        displayedImages,
        selectedImages,
        selectedLocation,
        showMap,
        toggleImageSelection,
        handleNextClick,
        handleLocationSelect,
        handleSubmitClick,
        handleConfirmLocation,
    };
};
