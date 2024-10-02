import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import { useLocation, useParams } from 'react-router-dom';

import { getPinPointImages } from '@/api/image';
import ImageCarousel from '@/components/ImageCarousel';
import Header from '@/components/layout/Header';
import { PAGE } from '@/constants/title';

interface ImageType {
    mediaFileId: string;
    mediaLink: string;
}

const MusicVideo = () => {
    const [displayedImages, setDisplayedImages] = useState<ImageType[]>([]);
    const { tripId, pinPointId } = useParams<{ tripId: string; pinPointId: string }>();
    const imagesUrl: string[] = [];

    const location = useLocation();
    const tripTitle = location.state;

    useEffect(() => {
        const fetchPinPointImages = async () => {
            try {
                if (!(tripId && pinPointId)) {
                    return;
                }
                const data = await getPinPointImages(tripId, pinPointId);
                console.log(data);
                const { images } = data.firstImage;
                setDisplayedImages(images);
            } catch (error) {
                console.error('Error fetching pinpoint-images data:', error);
            }
        };

        fetchPinPointImages();
    }, []);

    // console.log(displayedImages);

    const images = displayedImages.map((image) => imagesUrl.push(image.mediaLink));
    console.log(imagesUrl);
    return (
        <div>
            <Header title={tripTitle} isBackButton />

            {/* <div>
                {displayedImages?.map((image: ImageType) => (
                    <div key={image.mediaFileId} css={imageContainerStyle}>
                        <img src={image.mediaLink} alt={`image`} css={imageStyle} />
                    </div>
                ))}
            </div> */}
            <div css={carouselWrapper}>
                <ImageCarousel images={imagesUrl || undefined} />
            </div>
        </div>
    );
};

const carouselWrapper = css`
    height: 100vh;
`;

const imageStyle = css`
    width: 100%;
    height: 100%;
    /* object-fit: cover; */
`;

export default MusicVideo;
