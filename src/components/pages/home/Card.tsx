import { css } from '@emotion/react';

import { Trip } from '@/types/trip';

interface CardProps {
    trips: Trip[] | undefined;
}

const Card = ({ trips }: CardProps): JSX.Element => {
    const counties = trips?.map((trip) => trip.country);
    const uniqueCounties = [...new Set(counties)];

    return (
        <div className='home-trips' css={CardStyle}>
            {uniqueCounties?.length ? (
                <>
                    <p>지금까지 여행한 국가는</p>
                    <p>
                        <span>{uniqueCounties?.length}</span> 군데입니다.
                    </p>
                </>
            ) : (
                <p>새로운 여행을 등록해주세요!</p>
            )}
            {uniqueCounties?.length ? (
                <div className='home-flags'>
                    {uniqueCounties?.map((country, index) => <span key={index}>{country.slice(0, 4)}</span>)}
                </div>
            ) : (
                <div className='home-flags'>🇰🇷 🇯🇵 🇰🇷 🇯🇵 </div>
            )}
        </div>
    );
};

export default Card;

const CardStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 40px;
    width: 330px;

    p {
        font-size: 18px;
        font-weight: bold;
    }
    span {
        font-size: 30px;
        font-weight: bold;
    }
    div.home-flags {
        width: 60%;
        text-align: center;
        font-size: 16px;
        margin-top: 14px;
    }
`;
