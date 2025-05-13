import { useState } from 'react';

import { css } from '@emotion/react';
import { OverlayView, OverlayViewF } from '@react-google-maps/api';
import { X } from 'lucide-react';

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
    const [showImageDetail, setShowImageDetail] = useState(false);

    if (!isVisible) return null;

    const handleClick = (event: React.MouseEvent | React.TouchEvent) => {
        event.stopPropagation();
        onClick?.();
        setShowImageDetail(true);
    };

    return (
        <>
            <OverlayViewF
                position={{ lat: position.latitude, lng: position.longitude }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={() => getPixelPositionOffset(heightOffset)}
            >
                <div css={photoCardStyle} onClick={(event) => handleClick(event)}>
                    <img src={image} alt='포토카드' />
                </div>
            </OverlayViewF>

            {showImageDetail && (
                <div css={imageDetailWrapper}>
                    <div onClick={() => setShowImageDetail(false)}>
                        <X size={28} color={COLORS.BACKGROUND.WHITE} />
                    </div>
                    <img src={image} alt='포토카드' />
                </div>
            )}
        </>
    );
};

const imageDetailWrapper = css`
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: ${COLORS.BACKGROUND.BLACK};
    z-index: 9999;

    div {
        position: absolute;
        top: 14px;
        right: 14px;
        cursor: pointer;
    }

    img {
        width: 100%;
        pointer-events: none;
        user-select: none;
    }
`;

const photoCardStyle = css`
    background-color: ${COLORS.TEXT.WHITE};
    width: ${MAP.PHOTO_CARD_SIZE.WIDTH}px;
    height: ${MAP.PHOTO_CARD_SIZE.HEIGHT}px;
    border-radius: 15%;
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
        border-radius: 15%;
    }
`;

export default PhotoCard;
