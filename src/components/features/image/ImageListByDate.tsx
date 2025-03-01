import { Fragment, useState } from 'react';

import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import ImageGrid from '@/components/features/image/ImageGrid';
import ImageSizeRadio from '@/components/features/image/ImageSizeRadio';
import { ROUTES } from '@/constants/paths';
import theme from '@/styles/theme';
import { UnlocatedMediaFile, UnlocatedMediaFileModel } from '@/types/media';
import { formatToKorean } from '@/utils/date';

interface ImageListByDateProps {
    // imageGroupByDate: [string, ImageModel[]][];
    imageGroupByDate: UnlocatedMediaFileModel[];
    tripId: string | undefined;
    // selectedImages: ImageModel[];
    selectedImages: UnlocatedMediaFile[];
    onHashtagSelect: (image: UnlocatedMediaFile) => void;
    setIsMapVisible: (isMapVisible: boolean) => void;
}

const ImageListByDate = ({
    imageGroupByDate,
    selectedImages,
    onHashtagSelect,
    setIsMapVisible,
}: ImageListByDateProps) => {
    const [imageSize, setImageSize] = useState(3);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const handleSetLocationOnMap = () => {
        if (selectedImages.length > 0) {
            setIsMapVisible(true);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const navigateToTripList = () => {
        navigate(`${ROUTES.PATH.TRIPS.ROOT}`);
    };

    return (
        <>
            <ImageSizeRadio imageSize={imageSize} setImageSize={setImageSize} />
            <div css={imageListContainer}>
                {imageGroupByDate.map((image) => (
                    <Fragment key={image.recordDate}>
                        <h2 css={dateStyle}>{formatToKorean(image.recordDate.split('T')[0])}</h2>
                        <ImageGrid
                            imageSize={imageSize}
                            displayedImages={image.media}
                            selectedImages={selectedImages}
                            onHashtagSelect={onHashtagSelect}
                        />
                    </Fragment>
                ))}
            </div>
            <div css={buttonGroup}>
                <Button text='나가기' variant='white' onClick={openModal} />
                <Button text='위치 선택하기' onClick={handleSetLocationOnMap} disabled={selectedImages.length === 0} />
            </div>
            {isModalOpen && (
                <ConfirmModal
                    title='티켓 목록 페이지로 이동하시겠습니까?'
                    description='위치 등록은 언제든지 다시 할 수 있습니다'
                    confirmText='이동하기'
                    cancelText='아니요'
                    confirmModal={navigateToTripList}
                    closeModal={closeModal}
                />
            )}
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
    z-index: 10;
    display: flex;
    gap: 8px;
`;

export default ImageListByDate;
