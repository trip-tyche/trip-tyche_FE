import { useState, useEffect, useCallback } from 'react';

import { css } from '@emotion/react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import ImageCarousel from '@/components/features/image/ImageCarousel';
import { PATH } from '@/constants/path';
import useTimelineStore from '@/stores/useTimelineStore';
import theme from '@/styles/theme';
import { ImageCarouselModel, CarouselState } from '@/types/image';

const TimelinePinpointPage = () => {
    const [carouselImages, setCarouselImages] = useState<ImageCarouselModel[]>([]);
    const [carouselState, setCarouselState] = useState<CarouselState>('auto');

    const setCurrentPinPointId = useTimelineStore((state) => state.setCurrentPinPointId);

    const { tripId, pinPointId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getPinPointImagesData = async () => {
            if (!(tripId && pinPointId)) {
                return;
            }
            const pinPointData = await tripImageAPI.fetchImagesByPinPoint(tripId, pinPointId);
            const { images } = pinPointData.firstImage;
            setCarouselImages(images);
        };

        setCurrentPinPointId(pinPointId);
        localStorage.setItem('lastPinPointId', pinPointId || '');

        getPinPointImagesData();
    }, [tripId, pinPointId, setCurrentPinPointId]);

    const handleCarouselStateChange = useCallback((newState: CarouselState) => {
        setCarouselState(newState);
    }, []);

    const navigateBeforePage = () => {
        navigate(`${PATH.TRIPS.TIMELINE.MAP(Number(tripId))}`);
    };

    return (
        <div css={pageContainer}>
            {carouselState !== 'zoomed' && (
                <X size={24} color={theme.colors.modalBg} onClick={navigateBeforePage} css={iconStyle} />
            )}
            <ImageCarousel images={carouselImages} onStateChange={handleCarouselStateChange} />
        </div>
    );
};

const pageContainer = css`
    position: relative;
    /* height: 100dvh; */
`;

const iconStyle = css`
    position: absolute;
    cursor: pointer;
    top: 15px;
    right: 15px;
    z-index: 1000;
`;

// const carouselWrapper = css`
//     /* height: 100dvh; */
//     /* height: 100%; */
//     /* display: flex; */
//     /* align-items: center; */
//     /* justify-content: center; */
// `;

export default TimelinePinpointPage;
