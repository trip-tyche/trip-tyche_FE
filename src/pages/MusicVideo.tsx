import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';

import { getImagesByPinPoint } from '@/api/image';
import ImageCarousel from '@/components/ImageCarousel';
import Header from '@/components/layout/Header';

interface ImageType {
    mediaFileId: string;
    mediaLink: string;
}

const MusicVideo = () => {
    const [displayedImages, setDisplayedImages] = useState<ImageType[]>([]);
    const { tripId, pinPointId } = useParams<{ tripId: string; pinPointId: string }>();

    const tripTitle = localStorage.getItem('tripTitle');

    useEffect(() => {
        const fetchPinPointImages = async () => {
            try {
                if (!(tripId && pinPointId)) {
                    return;
                }
                const data = await getImagesByPinPoint(tripId, pinPointId);
                const { images } = data.firstImage;
                setDisplayedImages(images);
            } catch (error) {
                console.error('Error fetching pinpoint-images data:', error);
            }
        };

        fetchPinPointImages();
    }, [tripId, pinPointId]);

    return (
        <div css={containerStyle}>
            {tripTitle && <Header title={tripTitle} isBackButton />}
            <div css={carouselWrapper}>
                <ImageCarousel images={displayedImages} />
            </div>
        </div>
    );
};

const containerStyle = css`
    height: 100vh;
`;

const carouselWrapper = css`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default MusicVideo;
