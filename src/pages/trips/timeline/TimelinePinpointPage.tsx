import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import ImageCarousel from '@/components/features/image/ImageCarousel';
import { ROUTES } from '@/constants/paths';
import useTimelineStore from '@/stores/useTimelineStore';
import theme from '@/styles/theme';
import { CarouselState } from '@/types/common';
import { ImageCarouselModel } from '@/domain/media/image';
import { PinpointMediaModel } from '@/domain/media/types';

const TimelinePinpointPage = () => {
    const [carouselImages, setCarouselImages] = useState<ImageCarouselModel[]>([]);
    const [carouselState, setCarouselState] = useState<CarouselState>('auto');

    const setLastPinPointId = useTimelineStore((state) => state.setLastPinPointId);

    const { tripKey, pinPointId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getPinPointImagesData = async () => {
            if (!(tripKey && pinPointId)) {
                return;
            }
            const result = await tripImageAPI.fetchImagesByPinPoint(tripKey, pinPointId);
            const { mediaFiles } = result;

            const sortedImages = mediaFiles.sort((dateA: PinpointMediaModel, dateB: PinpointMediaModel) =>
                dateA.recordDate.localeCompare(dateB.recordDate),
            );

            setCarouselImages(sortedImages);
        };

        setLastPinPointId(pinPointId);
        localStorage.setItem('lastPinPointId', pinPointId || '');

        getPinPointImagesData();
    }, [tripKey, pinPointId, setLastPinPointId]);

    const navigateBeforePage = () => {
        if (typeof tripKey === 'string') {
            navigate(`${ROUTES.PATH.TRIPS.TIMELINE.MAP(tripKey)}`);
        }
    };

    return (
        <div css={pageContainer}>
            {carouselState !== 'zoomed' && (
                <X size={24} color={theme.COLORS.TEXT.WHITE} onClick={navigateBeforePage} css={iconStyle} />
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
