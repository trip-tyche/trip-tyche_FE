import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants/paths';
import { IMAGE_CAROUSEL_STATE } from '@/constants/ui';
import ImageCarousel from '@/domains/media/components/ImageCarousel';
import { MediaFile } from '@/domains/media/types';
import { mediaAPI } from '@/libs/apis';
import { sortByDate } from '@/libs/utils/sort';
import theme from '@/styles/theme';
import { ImageCarouselState } from '@/types';

const ImageByPinpointPage = () => {
    const [images, setImages] = useState<MediaFile[]>([]);
    const [carouselState, setCarouselState] = useState<ImageCarouselState>(IMAGE_CAROUSEL_STATE.AUTO);

    const { tripKey, pinPointId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getPinPointImagesData = async () => {
            if (!tripKey || !pinPointId) {
                return;
            }

            const result = await mediaAPI.fetchImagesByPinPoint(tripKey, pinPointId);
            const { mediaFiles } = result;

            setImages(sortByDate(mediaFiles));
        };

        getPinPointImagesData();
    }, [tripKey, pinPointId]);

    return (
        <div css={pageContainer}>
            {carouselState !== 'zoomed' && (
                <X
                    size={24}
                    color={theme.COLORS.TEXT.WHITE}
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
    top: 15px;
    right: 15px;
    z-index: 1000;
`;

export default ImageByPinpointPage;
