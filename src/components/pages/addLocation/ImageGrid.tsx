import { css } from '@emotion/react';
import { GoCheckCircleFill } from 'react-icons/go';

interface ImageGridProps {
    displayedImages: File[];
    selectedImages: File[];
    toggleImageSelection: (image: File) => void;
}

const ImageGrid = ({ displayedImages, selectedImages, toggleImageSelection }: ImageGridProps): JSX.Element => (
    <div css={gridStyle}>
        {displayedImages.map((image: File, index: number) => (
            <div key={index} css={imageContainerStyle} onClick={() => toggleImageSelection(image)}>
                <img src={URL.createObjectURL(image)} alt={`image-${index}`} css={imageStyle} />
                {selectedImages.some((file) => file.name === image.name) && (
                    <div css={selectedOverlayStyle}>
                        <GoCheckCircleFill css={checkIconStyle} />
                    </div>
                )}
            </div>
        ))}
    </div>
);

const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
`;

const imageContainerStyle = css`
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    cursor: pointer;
`;

const imageStyle = css`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const selectedOverlayStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: flex-end;
    padding: 10px;
`;

const checkIconStyle = css`
    color: white;
    font-size: 20px;
`;

export default ImageGrid;
