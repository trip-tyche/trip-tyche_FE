import { Fragment, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import ImageGrid from '@/components/features/image/ImageGrid';
import ImageSizeRadio from '@/components/features/image/ImageSizeRadio';
import { PATH } from '@/constants/path';
import { useToastStore } from '@/stores/useToastStore';
import useUserDataStore from '@/stores/useUserDataStore';
import theme from '@/styles/theme';
import { ImageModel } from '@/types/image';
import { formatToKorean } from '@/utils/date';

interface ImageListByDateProps {
    imageGroupByDate: [string, ImageModel[]][];
    tripId: string | undefined;
    selectedImages: ImageModel[];
    onHashtagSelect: (image: ImageModel) => void;
    setIsMapVisible: (isMapVisible: boolean) => void;
}

const ImageListByDate = ({
    imageGroupByDate,
    selectedImages,
    onHashtagSelect,
    setIsMapVisible,
    tripId,
}: ImageListByDateProps) => {
    const [imageSize, setImageSize] = useState(3);

    const isEditing = useUserDataStore((state) => state.isTripInfoEditing);
    const setIsEditing = useUserDataStore((state) => state.setIsTripInfoEditing);
    const showToast = useToastStore((state) => state.showToast);

    const navigate = useNavigate();
    const handleSetLocationOnMap = () => {
        if (selectedImages.length > 0) {
            setIsMapVisible(true);
        }
    };

    const navigateToTripInfo = () => {
        if (isEditing) {
            navigate(`${PATH.TRIPS.ROOT}`);
            showToast(`사진이 등록되었습니다.`);
            setIsEditing(false);
        } else {
            navigate(`${PATH.TRIPS.NEW.INFO(Number(tripId))}`);
        }
    };

    return (
        <>
            <ImageSizeRadio imageSize={imageSize} setImageSize={setImageSize} />
            <div css={imageListContainer}>
                {imageGroupByDate.map(([date, images]) => (
                    <Fragment key={date}>
                        <h2 css={dateStyle}>{formatToKorean(date)}</h2>
                        <ImageGrid
                            imageSize={imageSize}
                            displayedImages={images}
                            selectedImages={selectedImages}
                            onHashtagSelect={onHashtagSelect}
                        />
                    </Fragment>
                ))}
            </div>
            <div css={buttonGroup}>
                <Button text='건너뛰고 계속하기' variant='white' onClick={navigateToTripInfo} />
                <Button text='위치 선택하기' onClick={handleSetLocationOnMap} disabled={selectedImages.length === 0} />
            </div>
        </>
    );
};
const imageListContainer = css`
    overflow-y: auto;
    height: calc(100vh - 46px);
    padding-bottom: 76px;
`;

const dateStyle = css`
    font-size: ${theme.FONT_SIZES.XL};
    font-weight: bold;
    padding: 12px 0 12px 12px;
    background-color: #eee;
    border-bottom: 1px solid ${theme.COLORS.BORDER};
    border-top: 1px solid ${theme.COLORS.BORDER};
`;

const buttonGroup = css`
    width: 100%;
    max-width: 428px;
    position: fixed;
    background-color: ${theme.COLORS.BACKGROUND.WHITE};
    border-radius: 12px 12px 0 0;
    bottom: 0;
    padding: 12px;
    z-index: 1000;
    display: flex;
    gap: 8px;
`;

export default ImageListByDate;
