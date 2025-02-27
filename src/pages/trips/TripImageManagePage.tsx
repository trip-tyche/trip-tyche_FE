import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { Trash2, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import Header from '@/components/common/Header';
import { ROUTES } from '@/constants/paths';
import theme from '@/styles/theme';
import { MediaFile } from '@/types/media';

const TripImageManagePage = () => {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [selectedImages, setSelectedImages] = useState<MediaFile[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    useEffect(() => {
        const getTripImages = async () => {
            try {
                if (!tripId) return;

                const response = await tripImageAPI.getTripImages(tripId);
                setMediaFiles(response.mediaFiles);
            } catch (error) {
                console.error('Failed to fetch images:', error);
                // TODO: 에러 처리 추가
            }
        };

        getTripImages();
    }, [tripId]);

    const handleDeleteImages = async (imagesToDelete: MediaFile[]) => {
        try {
            // TODO: API 호출로 이미지 삭제 구현
            // await tripImageAPI.deleteImages(imagesToDelete.map(img => img.mediaFileId));

            setMediaFiles((prev) =>
                prev.filter(
                    (image) => !imagesToDelete.some((deleteImage) => deleteImage.mediaFileId === image.mediaFileId),
                ),
            );
            setSelectedImages([]);
            setIsSelectionMode(false);
        } catch (error) {
            console.error('Failed to delete images:', error);
            // TODO: 에러 처리 추가
        }
    };

    return (
        <div css={containerStyle}>
            <Header title='사진 관리' isBackButton onBack={() => navigate(ROUTES.PATH.TRIPS.ROOT)} />
            <main css={mainStyle}></main>
        </div>
    );
};

const containerStyle = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
`;

const mainStyle = css`
    flex: 1;
    /* padding: 20px; */
    display: flex;
    flex-direction: column;
`;

const gridContainer = css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding-bottom: 80px;
`;

const imageContainerStyle = css`
    position: relative;
    aspect-ratio: 1;
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
`;

const imageStyle = css`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const hoverOverlayStyle = css`
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
    }
`;

const selectionOverlayStyle = (isSelected: boolean) => css`
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, ${isSelected ? 0.5 : 0.3});
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 8px;
`;

const checkboxStyle = (isSelected: boolean) => css`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid white;
    background: ${isSelected ? theme.COLORS.PRIMARY : 'transparent'};
`;

const deleteButtonStyle = css`
    background: white;
    border-radius: 50%;
    padding: 8px;
    color: ${theme.COLORS.TEXT.ERROR};
    border: none;
    cursor: pointer;
`;

const buttonContainerStyle = css`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    display: flex;
    gap: 8px;
    background: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const buttonStyle = (isActive: boolean) => css`
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 500;
    cursor: pointer;
    background: ${isActive ? theme.COLORS.PRIMARY : theme.COLORS.TEXT.DESCRIPTION_LIGHT};
    color: ${isActive ? 'white' : theme.COLORS.PRIMARY};

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const deleteButtonTextStyle = css`
    background: ${theme.COLORS.TEXT.ERROR};
`;

export default TripImageManagePage;
