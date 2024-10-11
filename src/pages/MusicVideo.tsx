import { useState, useEffect, useCallback } from 'react';

import { css } from '@emotion/react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { getImagesByPinPoint } from '@/api/image';
import ImageCarousel from '@/components/ImageCarousel';
import { PATH } from '@/constants/path';

type CarouselState = 'auto' | 'paused' | 'zoomed';

interface ImageType {
    mediaFileId: string;
    mediaLink: string;
}

const MusicVideo = () => {
    const [displayedImages, setDisplayedImages] = useState<ImageType[]>([]);
    const [carouselState, setCarouselState] = useState<CarouselState>('auto');
    const { tripId, pinPointId } = useParams<{ tripId: string; pinPointId: string }>();

    const navigate = useNavigate();

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

    const handleCarouselStateChange = useCallback((newState: CarouselState) => {
        setCarouselState(newState);
    }, []);

    return (
        <div css={containerStyle}>
            {carouselState !== 'zoomed' && (
                <div css={backStyle} onClick={() => navigate(`${PATH.TIMELINE_MAP}/${tripId}`)}>
                    <X size={24} color='#FDFDFD' />
                </div>
            )}
            <div css={carouselWrapper}>
                <ImageCarousel images={displayedImages} onStateChange={handleCarouselStateChange} />
            </div>
        </div>
    );
};

const containerStyle = css`
    position: relative;
    height: 100dvh;
`;

const backStyle = css`
    position: absolute;
    cursor: pointer;
    top: 15px;
    right: 15px;
    z-index: 1000;
`;

const carouselWrapper = css`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default MusicVideo;
