import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '@/components/common/Header';
import { ROUTES } from '@/constants/paths';

const TripImageManagePage = () => {
    const navigate = useNavigate();
    const { tripId } = useParams();

    const navigateBeforePage = () => {
        navigate(-1);
    };

    const navigateImageAdd = () => {
        navigate(ROUTES.PATH.TRIPS.NEW.IMAGES(Number(tripId)));
    };

    return (
        <div css={containerStyle}>
            <Header title={ROUTES.PATH_TITLE.TRIPS.NEW.IMAGES} isBackButton onBack={navigateBeforePage} />
            <main css={mainStyle}>
                <button onClick={navigateImageAdd}>새로운 사진 추가</button>
                <button>삭제</button>
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

export default TripImageManagePage;
