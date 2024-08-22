import { css } from '@emotion/react';
import Navbar from '@/components/common/Navbar';
import Header from '@/components/layout/Header/Header';

export default function TripList() {
    return (
        <div css={containerStyle}>
            <Header title='여행관리' />

            <main css={mainContentStyle}></main>

            <Navbar />
        </div>
    );
}

const containerStyle = css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const mainContentStyle = css`
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;
`;
