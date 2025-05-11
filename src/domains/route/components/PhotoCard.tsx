import { useCallback } from 'react';

import { css } from '@emotion/react';
import { OverlayView } from '@react-google-maps/api';

import { MediaFile } from '@/domains/media/types';
import { COLORS } from '@/shared/constants/theme';
import { MAP } from '@/shared/constants/ui';

const PhotoCard = ({ marker }: { marker: MediaFile }) => {
    const getPixelPositionOffset = useCallback((height: number) => {
        const offset = {
            x: -MAP.PHOTO_CARD_SIZE.WIDTH / 2,
            y: -(-MAP.PHOTO_CARD_SIZE.HEIGHT + height),
        };
        return offset;
    }, []);

    return (
        <OverlayView
            position={{ lat: marker.latitude, lng: marker.longitude }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={() => getPixelPositionOffset(50)}
        >
            <div css={basePhotoCardStyle}>
                <img src={marker.mediaLink} alt='포토카드 이미지' />
            </div>
        </OverlayView>
    );
};

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

// const photoCardStyle = (isCurrentPin: boolean) => css`
//     ${basePhotoCardStyle}
//     opacity: ${isCurrentPin ? 1 : 0};
//     visibility: ${isCurrentPin ? 'visible' : 'hidden'};
//     pointer-events: ${isCurrentPin ? 'auto' : 'none'};
// `;

export default PhotoCard;
