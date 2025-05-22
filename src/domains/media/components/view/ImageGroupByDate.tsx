import { useEffect, useState } from 'react';

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
    onImageClick: () => void;
}

const ImageGroupByDate = ({ imageGroup, selectedImages, onImageClick }: ImageGroupByDateProps) => {
    const [imagesWithAddress, setImagesWithAddress] = useState<ImageFileWithAddress[]>([]);

    useEffect(() => {
        const getAddressFromLocation = async () => {
            if (imageGroup.images) {
                const { images } = imageGroup;

                const imagesWithAddress = await Promise.all(
                    images.map(async (image: MediaFile) => {
                        const address =
                            image.latitude && image.longitude
                                ? await getAddressFromImageLocation({
                                      latitude: image.latitude,
                                      longitude: image.longitude,
                                  })
                                : '';
                        const formattedAddress = address ? `${address.split(' ')[0]}, ${address.split(' ')[1]}` : '';
                        return {
                            ...image,
                            imageUrl: image.mediaLink,
                            address: formattedAddress,
                        };
                    }),
                );

                setImagesWithAddress(imagesWithAddress);
            }
        };
        getAddressFromLocation();
    }, [imageGroup]);

    const hasDate = hasValidDate(imageGroup.recordDate);

    console.log(imageGroup.recordDate);

    return (
        <div css={container}>
            {hasDate && (
                <div css={header}>
                    <Calendar size={20} />
                    <h2 css={dateStyle}>{formatToKorean(imageGroup.recordDate.split('T')[0])}</h2>
                </div>
            )}
            <div css={mainStyle}>
                {imagesWithAddress.map((image) => (
                    <ImageCard key={image.imageUrl} image={image} onClick={onImageClick} />
                ))}
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
