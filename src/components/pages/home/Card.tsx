import { css } from '@emotion/react';

import theme from '@/styles/theme';

interface CardProps {
    tripCount: number | undefined;
}

const Card = ({ tripCount }: CardProps) => (
    <div className='home-trips' css={CardStyle}>
        {tripCount ? (
            <>
                <h3>지금까지 여행한 국가는</h3>
                <h3>
                    <span>{tripCount}</span> 군데입니다.
                </h3>
            </>
        ) : (
            <h3>아직 등록된 여행 국가가 없네요 😆</h3>
        )}
    </div>
);
// {uniqueCounties?.length ? (
//     <div className='home-flags'>
//         {uniqueCounties?.map((country, index) => <span key={index}>{country.slice(0, 4)}</span>)}
//     </div>
// ) : (
//     <>
//         <p css={subtitleStyle}>보더패스에서 새로운 여행을 등록해주세요!</p>
//         {/* <div className='home-flags'>🇰🇷 🇯🇵 🇰🇷 🇯🇵 </div> */}
//     </>
// )}

export default Card;

const subtitleStyle = css`
    font-size: ${theme.fontSizes.large_16};
    color: ${theme.colors.descriptionText};
    margin-top: 14px;
`;

const CardStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px solid ${theme.colors.borderColor};
    box-shadow: ${theme.colors.boxShadowDown} ${theme.colors.boxShadowUp};
    padding: 16px;
    border-radius: 16px;
    width: 330px;

    h3 {
        font-size: 18px;
        font-weight: bold;
        margin: 4px;
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
