import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import ImageCarousel from '@/components/features/image/ImageCarousel';
import { PATH } from '@/constants/path';
import useTimelineStore from '@/stores/useTimelineStore';
import theme from '@/styles/theme';
import { ImageCarouselModel, CarouselStateType } from '@/types/image';

const TimelinePinpointPage = () => {
    const [carouselImages, setCarouselImages] = useState<ImageCarouselModel[]>([]);
    const [carouselState, setCarouselState] = useState<CarouselStateType>('auto');

    const setLastPinPointId = useTimelineStore((state) => state.setLastPinPointId);

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

        setLastPinPointId(pinPointId);
        localStorage.setItem('lastPinPointId', pinPointId || '');

        getPinPointImagesData();
    }, [tripId, pinPointId, setLastPinPointId]);

    const navigateBeforePage = () => {
        navigate(`${PATH.TRIPS.TIMELINE.MAP(Number(tripId))}`);
    };

    return (
        <div css={pageContainer}>
            {carouselState !== 'zoomed' && (
                <X size={24} color={theme.colors.modalBg} onClick={navigateBeforePage} css={iconStyle} />
            )}
            <ImageCarousel images={carouselImages} carouselState={carouselState} setCarouselState={setCarouselState} />
        </div>
    );
};

const pageContainer = css`
    position: relative;
`;

const iconStyle = css`
    position: absolute;
    cursor: pointer;
    top: 15px;
    right: 15px;
    z-index: 1000;
`;

export default TimelinePinpointPage;
