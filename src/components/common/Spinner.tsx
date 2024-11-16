import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';

import theme from '@/styles/theme';

type BackgroundType = 'light' | 'dark';
interface SpinnerProps {
    background?: BackgroundType;
}

const Spinner = ({ background = 'light' }: SpinnerProps) => (
    <div css={loadingSpinnerStyle}>
        <ClipLoader
            color={background === 'light' ? theme.colors.black : theme.colors.modalBg}
            size={30}
            speedMultiplier={0.7}
        />
    </div>
);

const loadingSpinnerStyle = css`
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default Spinner;
