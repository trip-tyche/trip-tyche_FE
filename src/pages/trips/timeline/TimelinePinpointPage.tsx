import { useState, useEffect, useCallback } from 'react';

import { css } from '@emotion/react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import ImageCarousel from '@/components/ImageCarousel';
import useTimelineStore from '@/stores/useTimelineStore';

type CarouselState = 'auto' | 'paused' | 'zoomed';

interface ImageType {
    mediaFileId: string;
    mediaLink: string;
}

const TimelinePinpointPage = () => {
    const [displayedImages, setDisplayedImages] = useState<ImageType[]>([]);
    const [carouselState, setCarouselState] = useState<CarouselState>('auto');
    const { tripId, pinPointId } = useParams<{ tripId: string; pinPointId: string }>();

    const navigate = useNavigate();
    const setCurrentPinPointId = useTimelineStore((state) => state.setCurrentPinPointId);

    useEffect(() => {
        const fetchPinPointImages = async () => {
            if (!(tripId && pinPointId)) {
                return;
            }
            const data = await tripImageAPI.fetchImagesByPinPoint(tripId, pinPointId);
            const { images } = data.firstImage;
            setDisplayedImages(images);
        };

        // 전역 스토어에 저장
        setCurrentPinPointId(pinPointId);
        // 로컬 스토리지에도 저장 (새로고침 대비)
        localStorage.setItem('lastPinPointId', pinPointId || '');

        fetchPinPointImages();
    }, [tripId, pinPointId]);

    const handleCarouselStateChange = useCallback((newState: CarouselState) => {
        setCarouselState(newState);
    }, []);

    const handleBack = () => {
        navigate(`/timeline-map/${tripId}`);
    };

    return (
        <div css={containerStyle}>
            {carouselState !== 'zoomed' && (
                <div css={backStyle} onClick={handleBack}>
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
    height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default TimelinePinpointPage;
