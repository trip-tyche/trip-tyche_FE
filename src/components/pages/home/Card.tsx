import { css } from '@emotion/react';

import theme from '@/styles/theme';

interface CardProps {
    tripCount: number | undefined;
}

const Card = ({ tripCount }: CardProps) => (
    <div className='home-trips' css={CardStyle}>
        {tripCount ? (
            <h3>
                지금까지 <span>{tripCount}</span> 장의 여행 티켓이 있어요!
            </h3>
        ) : (
            <h3>아래 버튼을 눌러서 새 여행을 등록해주세요 </h3>
        )}
    </div>
);

export default Card;

const CardStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid ${theme.colors.borderColor};
    box-shadow: ${theme.colors.boxShadowDown} ${theme.colors.boxShadowUp};
    padding: 16px;
    border-radius: 16px;
    width: 330px;

    h3 {
        font-size: ${theme.fontSizes.normal_14};
        color: ${theme.colors.descriptionText};
        font-weight: bold;
    }
    span {
        font-size: ${theme.fontSizes.xlarge_18};
        color: ${theme.colors.primary};
        font-weight: bold;
    }
`;
