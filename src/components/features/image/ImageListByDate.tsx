import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import ImageGrid from '@/components/features/image/ImageGrid';
import { PATH } from '@/constants/path';
import { useToastStore } from '@/stores/useToastStore';
import useUserDataStore from '@/stores/useUserDataStore';
import theme from '@/styles/theme';
import { ImageModel } from '@/types/image';
import { formatDateToKorean } from '@/utils/date';

interface ImageListByDateProps {
    imageGroupByDate: [string, ImageModel[]][];
    selectedImages: ImageModel[];
    toggleImageSelect: (image: ImageModel) => void;
    setIsMapVisible: (isMapVisible: boolean) => void;
    tripId: string | undefined;
}

const ImageListByDate = ({
    imageGroupByDate,
    selectedImages,
    toggleImageSelect,
    setIsMapVisible,
    tripId,
}: ImageListByDateProps) => {
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
            <div css={listContainerStyle}>
                {imageGroupByDate.map(([date, images]) => (
                    <div key={date} css={dateGroupStyle}>
                        <h2 css={dateHeaderStyle}>{formatDateToKorean(date)}</h2>
                        <ImageGrid
                            displayedImages={images}
                            selectedImages={selectedImages}
                            toggleImageSelect={toggleImageSelect}
                        />
                    </div>
                ))}
            </div>
            <div css={buttonGroup}>
                <Button text='건너뛰고 계속하기' variant='white' onClick={navigateToTripInfo} />
                <Button text='위치 선택하기' onClick={handleSetLocationOnMap} disabled={selectedImages.length === 0} />
            </div>
        </>
    );
};

const listContainerStyle = css`
    overflow-y: auto;
    max-height: calc(100vh - 60px);
`;

const dateGroupStyle = css`
    margin-bottom: 20px;
`;

const dateHeaderStyle = css`
    font-size: 18px;
    font-weight: 600;
    height: 44px;
    display: flex;
    align-items: center;
    padding-left: 8px;
    background-color: #eee;
    border: 1px solid #ccc;
`;

const buttonGroup = css`
    width: 100%;
    max-width: 428px;
    position: fixed;
    background-color: ${theme.colors.modalBg};
    border-radius: 12px 12px 0 0;
    bottom: 0;
    padding: 12px;
    z-index: 1000;
    display: flex;
    gap: 8px;
`;

export default ImageListByDate;
