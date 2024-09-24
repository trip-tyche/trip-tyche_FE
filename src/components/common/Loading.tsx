import { css } from '@emotion/react';
import { HashLoader } from 'react-spinners';

const Loading = () => (
    <div css={loadingWrapperStyle}>
        <HashLoader color='#2048f3' size={50} speedMultiplier={1} />
    </div>
);

const loadingWrapperStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
`;

export default Loading;
