import { useRef } from 'react';

import { css } from '@emotion/react';
import { Upload } from 'lucide-react';

import Button from '@/shared/components/common/Button';
import { COLORS } from '@/shared/constants/style';

interface MediaUploadSectionProps {
    title?: string;
    description?: string;
    onImageSelect?: () => void;
}

const MediaUploadSection = ({
    title = '사진을 업로드해주세요',
    description = `여행 중 찍은 사진을 업로드하면\n자동으로 여행 경로를 만들어드립니다`,
    onImageSelect,
}: MediaUploadSectionProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        inputRef.current?.click();
    };

    return (
        <>
            <input
                ref={inputRef}
                type='file'
                accept='image/*,.heic'
                multiple
                onChange={onImageSelect}
                css={inputStyle}
                id='input'
            />

            <label htmlFor='input' css={imageUploadSection}>
                <div css={uploadIconWrapper}>
                    <Upload size={40} color={COLORS.PRIMARY} />
                </div>
                <p css={uploadTitleStyle}>{title}</p>
                <p css={uploadDescriptionStyle}>{description}</p>
                <div css={uploadButtonWrapper}>
                    <Button text='사진 선택하기' onClick={handleButtonClick} />
                </div>
            </label>
        </>
    );
};

const inputStyle = css`
    display: none;
`;

const imageUploadSection = css`
    flex: 1;
    border: 2px dashed ${COLORS.BORDER};
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: ${COLORS.BACKGROUND.WHITE};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
`;

const uploadIconWrapper = css`
    background-color: #eaf0f9;
    padding: 1rem;
    border-radius: 9999px;
    margin-bottom: 1rem;
`;

const uploadTitleStyle = css`
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
    color: ${COLORS.TEXT.BLACK};
`;

const uploadDescriptionStyle = css`
    margin-bottom: 24px;
    font-size: 14px;
    color: #6b7280;
    text-align: center;
    line-height: 1.5;
    white-space: pre-line;
`;

const uploadButtonWrapper = css`
    width: 160px;
    font-weight: 600;
`;

export default MediaUploadSection;
