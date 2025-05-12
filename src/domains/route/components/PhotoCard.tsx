import { css } from '@emotion/react';
import { OverlayView } from '@react-google-maps/api';

import { getPixelPositionOffset } from '@/libs/utils/map';
import { COLORS } from '@/shared/constants/theme';
import { MAP } from '@/shared/constants/ui';
import { Location } from '@/shared/types/map';

interface PhotoCardProps {
    position: Location;
    image: string;
    heightOffset: number;
    isVisible?: boolean;
    onClick?: () => void;
}

const PhotoCard = ({ position, image, isVisible, heightOffset, onClick }: PhotoCardProps) => {
    return (
        <OverlayView
            position={{ lat: position.latitude, lng: position.longitude }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={() => getPixelPositionOffset(heightOffset)}
        >
            <div css={photoCardStyle(isVisible)}>
                <img src={image} alt='포토카드' onClick={onClick} />
            </div>
        </OverlayView>
    );
};

const photoCardStyle = (isVisible = true) => css`
    ${basePhotoCardStyle}
    opacity: ${isVisible ? 1 : 0};
    visibility: ${isVisible ? 'visible' : 'hidden'};
    pointer-events: ${isVisible ? 'auto' : 'none'};
`;

const basePhotoCardStyle = css`
    background-color: ${COLORS.TEXT.WHITE};
    width: ${MAP.PHOTO_CARD_SIZE.WIDTH}px;
    height: ${MAP.PHOTO_CARD_SIZE.HEIGHT}px;
    border-radius: 20%;
    padding: 1px;
    box-shadow:
        rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    cursor: pointer;
    transition: transform 0.2s ease;
    position: relative;

    &:hover {
        transform: scale(1.05);
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid white;
        box-shadow:
            rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
            rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }

    img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 20%;
    }
`;

export default PhotoCard;
