import { css } from '@emotion/react';
import Navbar from '@/components/common/Navbar';
import Header from '@/components/layout/Header/Header';
import Button from '@/components/common/Button/Button';
import { useNavigate } from 'react-router-dom';
import BorderPass from '@/components/BorderPass';

export default function TripList() {
    const navigator = useNavigate();

    const goToTripCreatePage = () => {
        navigator('/trip-create');
    };

    return (
        <div css={containerStyle}>
            <main css={mainContentStyle}>
                <Header title='여행관리' />
                <div css={buttonStyle}>
                    <Button text='여행 등록' theme='sec' size='sm' onClick={goToTripCreatePage} />
                </div>
                <div css={tripListStyle}>
                    <BorderPass />
                    <BorderPass />
                    <BorderPass />
                    <BorderPass />
                </div>
            </main>

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
    margin-bottom: 6rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const buttonStyle = css`
    display: flex;
    justify-content: end;
    padding: 1.5rem;
`;

const tripListStyle = css`
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 18px;
`;
