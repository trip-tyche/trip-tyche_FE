import React from 'react';

import { css } from '@emotion/react';

import theme from '@/styles/theme';

interface ImageSizeRadioProps {
    imageSize: number;
    setImageSize: (imageSize: number) => void;
}

const ImageSizeRadio = ({ imageSize, setImageSize }: ImageSizeRadioProps) => {
    const handleImageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageSize(Number(event.target.value));
    };

    return (
        <div css={sizeOptionContainer}>
            <p css={titleStyle}>사진 크기</p>
            <>
                <label css={labelStyle}>
                    <input
                        type='radio'
                        name='size'
                        value={1}
                        checked={imageSize === 1}
                        onChange={handleImageSizeChange}
                    />
                    크게
                </label>
                <label css={labelStyle}>
                    <input
                        type='radio'
                        name='size'
                        value={3}
                        checked={imageSize === 3}
                        onChange={handleImageSizeChange}
                    />
                    보통
                </label>
                <label css={labelStyle}>
                    <input
                        type='radio'
                        name='size'
                        value={5}
                        checked={imageSize === 5}
                        onChange={handleImageSizeChange}
                    />
                    작게
                </label>
            </>
        </div>
    );
};

const sizeOptionContainer = css`
    padding: 12px;
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 12px;
    font-size: ${theme.fontSizes.normal_14};
`;

const titleStyle = css`
    font-weight: bold;
`;

const labelStyle = css`
    display: flex;
    gap: 4px;
`;

export default ImageSizeRadio;
