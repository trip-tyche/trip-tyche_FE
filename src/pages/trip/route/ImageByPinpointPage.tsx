import { useState } from 'react';

import { css } from '@emotion/react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import ImageCarousel from '@/domains/media/components/ImageCarousel';
import { useMediaByPinPoint } from '@/domains/media/hooks/queries';
import { ROUTES } from '@/shared/constants/paths';
import { COLORS } from '@/shared/constants/theme';
import { IMAGE_CAROUSEL_STATE } from '@/shared/constants/ui';
import { ImageCarouselState } from '@/shared/types';

const ImageByPinpointPage = () => {
    const [carouselState, setCarouselState] = useState<ImageCarouselState>(IMAGE_CAROUSEL_STATE.AUTO);

    const { tripKey, pinPointId } = useParams();
    const navigate = useNavigate();

    const { data: result } = useMediaByPinPoint(tripKey!, pinPointId!);

    if (!result) return;
    if (!result.success) {
        return;
    }

    const images = result.data;

    return (
        <div css={pageContainer}>
            {carouselState !== 'zoomed' && (
                <X
                    size={28}
                    color={COLORS.BACKGROUND.WHITE}
                    onClick={() =>
                        navigate(`${ROUTES.PATH.TRIP.ROUTE.ROOT(tripKey!)}`, {
                            state: { lastLoactedPinPointId: pinPointId },
                        })
                    }
                    css={iconStyle}
                />
            )}
            <ImageCarousel images={images} carouselState={carouselState} setCarouselState={setCarouselState} />
        </div>
    );
};

const pageContainer = css`
    position: relative;
`;

const iconStyle = css`
    position: absolute;
    cursor: pointer;
    top: 14px;
    right: 14px;
    z-index: 1000;
`;

export default ImageByPinpointPage;
