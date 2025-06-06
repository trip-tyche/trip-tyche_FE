import { useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';
import { Calendar } from 'lucide-react';

import ImageCard from '@/domains/media/components/upload/ImageCard';
import { ImageFileWithAddress, MediaFile } from '@/domains/media/types';
import { getAddressFromImageLocation } from '@/domains/media/utils';
import { formatToKorean } from '@/libs/utils/date';
import { hasValidDate } from '@/libs/utils/validate';

interface ImageGroupByDateProps {
    imageGroup: {
        recordDate: string;
        images: MediaFile[];
    };
    selectedImages: MediaFile[];
    onImageClick: (selectedImage: MediaFile) => void;
    onLoad: () => void;
}

const ImageGroupByDate = ({ imageGroup, selectedImages, onImageClick, onLoad }: ImageGroupByDateProps) => {
    const [imagesWithAddress, setImagesWithAddress] = useState<ImageFileWithAddress[]>([]);
    const [isAddressConverting, setIsAddressCoverting] = useState(false);
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);

    const loadedImageCount = useRef(0);

    useEffect(() => {
        if (!isAddressConverting && isImagesLoaded) {
            onLoad();
        }
    }, [isAddressConverting, isImagesLoaded, onLoad]);

    useEffect(() => {
        const getAddressFromLocation = async () => {
            if (imageGroup.images) {
                const { images } = imageGroup;

                setIsAddressCoverting(true);
                const imagesWithAddress = await Promise.all(
                    images.map(async (image: MediaFile) => {
                        const address =
                            image.latitude && image.longitude
                                ? await getAddressFromImageLocation({
                                      latitude: image.latitude,
                                      longitude: image.longitude,
                                  })
                                : '';

                        const formattedAddress = address
                            ? address.startsWith('주소를')
                                ? address
                                : `${address.split(' ')[0]}, ${address.split(' ').slice(1).join(' ')}`
                            : '';
                        return {
                            ...image,
                            address: formattedAddress,
                        };
                    }),
                );

                const sortedImages = imagesWithAddress.sort((a, b) => {
                    return new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime();
                });

                setIsAddressCoverting(false);
                setImagesWithAddress(sortedImages);
            }
        };

        getAddressFromLocation();
    }, [imageGroup]);

    const handleAllImagesLoad = () => {
        loadedImageCount.current += 1;
        if (loadedImageCount.current === imageGroup.images.length) {
            setIsImagesLoaded(true);
        }
    };

    const hasDate = hasValidDate(imageGroup.recordDate);

    return (
        <div css={container}>
            {hasDate && (
                <div css={header}>
                    <Calendar size={20} />
                    <h2 css={dateStyle}>{formatToKorean(imageGroup.recordDate.split('T')[0])}</h2>
                </div>
            )}
            <div css={mainStyle}>
                {imagesWithAddress.map((image) => {
                    const isSelected = selectedImages.some(
                        (selectedImage) => selectedImage.mediaFileId === image.mediaFileId,
                    );

                    return (
                        <div
                            key={image.mediaFileId}
                            onClick={() => onImageClick(image)}
                            css={css`
                                cursor: pointer;
                            `}
                        >
                            <ImageCard image={image} isSelected={isSelected} isTimeView onLoad={handleAllImagesLoad} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const container = css`
    margin-top: 24px;
`;

const header = css`
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const dateStyle = css`
    font-weight: 600;
`;

const mainStyle = css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
`;

export default ImageGroupByDate;
