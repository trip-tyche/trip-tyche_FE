import { useCallback, useState } from 'react';

import { css } from '@emotion/react';
import { OverlayView, OverlayViewF } from '@react-google-maps/api';
import { X } from 'lucide-react';

import { getPixelPositionOffset } from '@/libs/utils/map';
import Spinner from '@/shared/components/common/Spinner';
import { COLORS } from '@/shared/constants/style';
import { MAP } from '@/shared/constants/ui';
import { Location } from '@/shared/types/map';

interface PhotoCardProps {
    position: Location;
    image: string;
    heightOffset: number;
    isVisible?: boolean;
    onClick?: () => void;
}

const PhotoCard = ({ position, image, isVisible = true, heightOffset, onClick }: PhotoCardProps) => {
    const [showImageDetail, setShowImageDetail] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        event.stopPropagation();

        if (event.type.startsWith('touch')) {
            console.log('event.type: ', event.type);
            event.preventDefault();
        }

        if (onClick) {
            onClick();
        } else {
            setShowImageDetail(true);
        }
    }, []);

    const handleImageLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    const closeImageDetail = () => {
        setShowImageDetail(false);
    };

    if (!isVisible) return null;

    return (
        <>
            <OverlayViewF
                position={{ lat: position.latitude, lng: position.longitude }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={() => getPixelPositionOffset(heightOffset)}
            >
                <div
                    css={photoCardStyle(isLoading)}
                    onTouchStart={(event) => handleClick(event)}
                    onClick={(event) => handleClick(event)}
                >
                    {isLoading && (
                        <div css={spinnerWrapper}>
                            <Spinner />
                        </div>
                    )}
                    <img src={image} alt='포토카드' onLoad={handleImageLoad} />
                </div>
            </OverlayViewF>

            {showImageDetail && (
                <>
                    <div css={imageDetailWrapper}>
                        <div onClick={closeImageDetail}>
                            <X size={24} color={COLORS.BACKGROUND.WHITE} />
                        </div>
                        <img src={image} alt='포토카드' />
                    </div>
                    <div css={overlay} onClick={closeImageDetail} />
                </>
            )}
        </>
    );
};

const overlay = css`
    position: fixed;
    inset: 0;
    z-index: 999;
    background-color: ${COLORS.BACKGROUND.BLACK};
    opacity: 0.9;
    cursor: pointer;
`;

const imageDetailWrapper = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% - 24px));
    width: 90%;
    max-height: calc(100dvh - 96px);
    border-radius: 16px;
    overflow: hidden;

    z-index: 9999;

    div {
        padding: 4px;
        position: absolute;
        top: 14px;
        right: 14px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${COLORS.BACKGROUND.BLACK};
        transition: background-color 0.2s;
        cursor: pointer;

        &:hover {
            background: #000000;
        }
    }

    img {
        width: 100%;
        pointer-events: none;
        user-select: none;
    }
`;

const photoCardStyle = (isLoading: boolean) => css`
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
        opacity: ${isLoading ? 0 : 1};
        transition: opacity 0.3s ease;
    }
`;

const spinnerWrapper = css`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default PhotoCard;
