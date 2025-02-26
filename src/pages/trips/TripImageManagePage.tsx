// import { css } from '@emotion/react';
// import { useNavigate, useParams } from 'react-router-dom';

// import Header from '@/components/common/Header';
// import { ROUTES } from '@/constants/paths';

// const TripImageManagePage = () => {
//     const navigate = useNavigate();
//     const { tripId } = useParams();

//     const navigateBeforePage = () => {
//         navigate(-1);
//     };

//     const navigateImageAdd = () => {
//         navigate(ROUTES.PATH.TRIPS.NEW.IMAGES(Number(tripId)));
//     };

//     return (
//         <div css={containerStyle}>
//             <Header title={ROUTES.PATH_TITLE.TRIPS.NEW.IMAGES} isBackButton onBack={navigateBeforePage} />
//             <main css={mainStyle}>
//                 <button onClick={navigateImageAdd}>새로운 사진 추가</button>
//                 <button>삭제</button>
//             </main>
//         </div>
//     );
// };

// const containerStyle = css`
//     height: 100dvh;
//     display: flex;
//     flex-direction: column;
// `;

// const mainStyle = css`
//     flex: 1;
//     padding: 20px;
//     display: flex;
//     flex-direction: column;
// `;

// export default TripImageManagePage;

import { useState, useEffect } from 'react';

import { css } from '@emotion/react';
import { Trash2, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { tripImageAPI } from '@/api';
import Header from '@/components/common/Header';
import { ROUTES } from '@/constants/paths';
import theme from '@/styles/theme';

interface MediaFile {
    mediaFileId: number;
    mediaLink: string;
    recordDate: string;
    latitude: number;
    longitude: number;
}

interface RouteParams {
    tripId: string;
}

const TripImageManagePage = () => {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [selectedImages, setSelectedImages] = useState<MediaFile[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    useEffect(() => {
        const fetchTripImages = async () => {
            try {
                if (!tripId) return;
                const response = await tripImageAPI.getAllImages(tripId);
                setMediaFiles(response.mediaFiles);
            } catch (error) {
                console.error('Failed to fetch images:', error);
                // TODO: 에러 처리 추가
            }
        };

        fetchTripImages();
    }, [tripId]);

    const navigateBeforePage = () => {
        navigate(`${ROUTES.PATH.TRIPS.ROOT}`);
    };

    console.log(mediaFiles);

    const navigateImageAdd = () => {
        if (!tripId) return;
        navigate(ROUTES.PATH.TRIPS.NEW.IMAGES(Number(tripId)));
    };

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

    const toggleImageSelection = (image: MediaFile) => {
        if (!isSelectionMode) return;

        setSelectedImages((prev) => {
            const isSelected = prev.some((img) => img.mediaFileId === image.mediaFileId);
            if (isSelected) {
                return prev.filter((img) => img.mediaFileId !== image.mediaFileId);
            }
            return [...prev, image];
        });
    };

    const isImageSelected = (image: MediaFile): boolean =>
        selectedImages.some((img) => img.mediaFileId === image.mediaFileId);

    return (
        <div css={containerStyle}>
            <Header title={ROUTES.PATH_TITLE.TRIPS.NEW.IMAGES} isBackButton onBack={navigateBeforePage} />
            <main css={mainStyle}>
                <div css={gridContainer}>
                    {mediaFiles.map((image, index) => (
                        <div
                            key={image.mediaFileId}
                            css={imageContainerStyle}
                            onClick={() => toggleImageSelection(image)}
                        >
                            <img src={image.mediaLink} alt={`Trip image ${index + 1}`} css={imageStyle} />
                            {isSelectionMode ? (
                                <div css={selectionOverlayStyle(isImageSelected(image))}>
                                    <div css={checkboxStyle(isImageSelected(image))} />
                                </div>
                            ) : (
                                <div css={hoverOverlayStyle}>
                                    <button
                                        css={deleteButtonStyle}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteImages([image]);
                                        }}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div css={buttonContainerStyle}>
                    <button css={buttonStyle(isSelectionMode)} onClick={() => setIsSelectionMode(!isSelectionMode)}>
                        {isSelectionMode ? '선택 취소' : '사진 선택'}
                    </button>
                    {isSelectionMode ? (
                        <button
                            css={[buttonStyle(true), deleteButtonTextStyle]}
                            onClick={() => handleDeleteImages(selectedImages)}
                            disabled={selectedImages.length === 0}
                        >
                            선택 삭제 ({selectedImages.length})
                        </button>
                    ) : (
                        <button css={buttonStyle(false)} onClick={navigateImageAdd}>
                            <Plus size={20} />
                            새로운 사진 추가
                        </button>
                    )}
                </div>
            </main>
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
    padding: 20px;
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

const selectionOverlayStyle = (isSelected) => css`
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, ${isSelected ? 0.5 : 0.3});
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 8px;
`;

const checkboxStyle = (isSelected) => css`
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
    color: ${theme.COLORS.RED};
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

const buttonStyle = (isActive) => css`
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
