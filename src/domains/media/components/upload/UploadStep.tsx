import { css } from '@emotion/react';

import MediaUploadSection from '@/domains/media/components/MediaUploadSection';
import Guide from '@/shared/components/common/Guide';
import { GUIDE_MESSAGE, MESSAGE } from '@/shared/constants/ui';

const UploadStep = ({ onImageSelect }: { onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <>
            <Guide title='사진 등록 가이드' texts={GUIDE_MESSAGE.IMAGE_UPLOAD} />
            <MediaUploadSection onImageSelect={onImageSelect} />
            <p css={quoteText}>{MESSAGE.QUOTE}</p>
        </>
    );
};

const quoteText = css`
    margin-top: 16px;
    text-align: center;
    font-size: 12px;
    color: #6b7280;
    font-style: italic;
`;

export default UploadStep;
