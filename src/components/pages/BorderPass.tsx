// import { css } from '@emotion/react';
// import characterImg from '@/assets/images/character.png';

// const BorderPass = () => {
//     return (
//         <div css={borderPass}>
//             <div className='borderPass' css={borderPassLeft}>
//                 <div className='borderPass-top'>JAPAN</div>
//                 <div className='borderPass-mid'>
//                     <img src={characterImg} alt='border-pass-character' />
//                     <p>BORDER PASS</p>
//                 </div>
//                 <div className='borderPass-bottom'></div>
//             </div>
//             <div className='borderPass' css={borderPassRight}>
//                 <div className='borderPass-top'>원준이 형과의 뜨거운 라오스 여행</div>
//                 <div className='borderPass-mid'></div>
//                 <div className='borderPass-bottom'></div>
//             </div>
//         </div>
//     );
// };
import { css } from '@emotion/react';

import characterImg from '@/assets/images/character.png';

// 인터페이스 정의
interface Trip {
    tripId: string;
    tripTitle: string;
    country: string;
    startDate: string;
    endDate: string;
    hashtags: string[];
}
interface FormattedTrip extends Omit<Trip, 'startDate' | 'endDate'> {
    startDate: string;
    endDate: string;
}

interface BorderPassProps {
    trip: FormattedTrip;
    userNickName: string;
}

const BorderPass: React.FC<BorderPassProps> = ({ trip, userNickName }) => (
    <div css={borderPassContainer}>
        <div css={borderPassLeft}>
            <div css={countryName}>{trip.country}</div>
            <img src={characterImg} alt='character' css={characterImage} />
            <div css={borderPassText}>BORDER PASS</div>
        </div>
        <div css={borderPassRight}>
            <h3 css={tripTitle}>{trip.tripTitle}</h3>
            <div css={tripInfo}>
                <p>
                    <strong>PASSENGER:</strong> {userNickName}
                </p>
                <p>
                    <strong>FROM:</strong> INCHEON
                </p>
                <p>
                    <strong>TO:</strong> {trip.country}
                </p>
                <p>
                    <strong>DATE:</strong> {trip.startDate} ~ {trip.endDate}
                </p>
            </div>
            <div css={hashtagContainer}>
                {trip.hashtags.map((tag, index) => (
                    <span key={index} css={hashtag}>
                        #{tag}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

const borderPassContainer = css`
    display: flex;
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* margin-bottom: 20px; */
`;

const borderPassLeft = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.2);
`;

const borderPassRight = css`
    flex: 2;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const countryName = css`
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const characterImage = css`
    width: 55px;
    /* height: 60px; */
    /* border-radius: 50%; */
    object-fit: cover;
    /* border: 2px solid #fff; */
`;

const borderPassText = css`
    font-size: 12px;
    font-weight: bold;
    color: #fff;
    text-transform: uppercase;
`;

const tripTitle = css`
    font-size: 18px;
    color: #fff;
    margin-bottom: 10px;
`;

const tripInfo = css`
    font-size: 14px;
    color: #fff;

    p {
        margin: 5px 0;
    }

    strong {
        font-weight: bold;
    }
`;

const hashtagContainer = css`
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
`;

const hashtag = css`
    background-color: rgba(255, 255, 255, 0.3);
    color: #fff;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 12px;
    margin-right: 5px;
    margin-bottom: 5px;
`;

export default BorderPass;
