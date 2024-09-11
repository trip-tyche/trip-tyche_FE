import { css } from '@emotion/react';

interface CardProps {
    trips: number | undefined;
    tripFlags: string[] | undefined;
}

const Card = ({ trips, tripFlags }: CardProps): JSX.Element => (
    <div className='home-trips' css={CardStyle}>
        <p>지금까지 여행한 국가는</p>
        <p>
            <span>{trips}</span> 군데입니다.
        </p>
        <div className='home-flags'>{/* <span>{tripFlags?.map(tripfl)}</span> */}</div>
    </div>
);

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
        margin-top: 8px;
    }
`;
