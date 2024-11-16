import { css } from '@emotion/react';
import { ImagePlus } from 'lucide-react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { IoAirplaneSharp } from 'react-icons/io5';

import characterImg from '@/assets/images/character-1.png';
import { useTicket3DEffect } from '@/hooks/useTicket3DEffect';
import theme from '@/styles/theme';
import { FormattedTripDate } from '@/types/trip';

interface BorderPassProps {
    trip: FormattedTripDate;
    userNickname: string;
}

const HomeBorderPass = ({ trip, userNickname }: BorderPassProps) => {
    const { tripTitle, country, startDate, endDate, hashtags } = trip;

    const { ticketStyle, handlers } = useTicket3DEffect();

    return (
        <div
            css={[borderPassContainer, interactionTicketStyle]}
            style={ticketStyle}
            onMouseMove={handlers.handleMouseMove}
            onMouseLeave={handlers.handleMouseLeave}
            onTouchStart={handlers.handleTouchStart}
            onTouchMove={handlers.handleTouchMove}
            onTouchEnd={handlers.handleTouchEnd}
        >
            <div css={mainContent}>
                <div css={leftContent}>
                    <div css={topSection}>
                        <div css={leftTopSection}>
                            <div>
                                <div css={label}>PASSENGER</div>
                                <div css={value}>{userNickname}</div>
                            </div>
                            <div>
                                <div css={label}>DATE</div>
                                <div css={value}>{startDate}</div>
                            </div>
                            <div>
                                <div css={label}>DATE</div>
                                <div css={value}>{endDate}</div>
                            </div>
                        </div>
                    </div>
                    <div css={contentContainer}>
                        <div css={citiesStyle}>
                            <div>인천</div>
                            <IoAirplaneSharp />
                            <div>{country.substring(4)}</div>
                        </div>
                        <div css={titleStyle}>{tripTitle}</div>
                        <div css={hashtagContainer}>
                            {hashtags.map((tag, index) => (
                                <span key={index} css={hashtag}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div css={buttonContainer}>
                        <div css={buttonStyle}>
                            <ImagePlus size={16} /> 사진등록
                        </div>
                        <div css={buttonStyle}>
                            <FaPencilAlt size={12} /> 여행수정
                        </div>
                        <div css={buttonStyle}>
                            <FaTrashAlt size={12} /> 여행삭제
                        </div>
                    </div>
                </div>
                <div css={rightSection}>
                    <div css={rightTopSection}>
                        <div css={label}>FLIGHT</div>
                        <div css={value}>TYCHE AIR</div>
                    </div>
                    <div css={rightContent}>
                        <img src={characterImg} alt='Character' css={characterImageStyle} />
                        <div css={textStyle}>Click Here!</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const borderPassContainer = css`
    width: 100%;
    max-width: 428px;
    border-radius: 10px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    background: white;
`;

const interactionTicketStyle = css`
    touch-action: none;
    box-shadow:
        0 6px 8px rgba(0, 0, 0, 0.1),
        0 1px 3px rgba(0, 0, 0, 0.08);
`;

const mainContent = css`
    display: flex;
    background: transparent;
`;

const topSection = css`
    background-color: ${theme.colors.primary};
    color: white;
`;

const leftTopSection = css`
    display: flex;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 10px 15px;
`;

const leftContent = css`
    width: 75%;
    background: white;
    border-right: 1px solid #e0e0e0;
`;

const rightSection = css`
    width: 25%;
    background: white;
    transition: transform 0.5s ease;
`;

const rightTopSection = css`
    padding: 10px;
    background-color: ${theme.colors.primary};
    color: white;
`;

const rightContent = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100% - 50px); // 상단 섹션 높이를 뺀 나머지
    background: white;
`;

const label = css`
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 2px;
`;

const value = css`
    font-size: 12px;
    font-weight: bold;
`;

const contentContainer = css`
    padding: 15px 15px 10px 15px;
`;

const citiesStyle = css`
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const titleStyle = css`
    margin-bottom: 24px;
    font-weight: bold;
`;

const hashtagContainer = css`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
`;

const hashtag = css`
    background-color: #f0f0f0;
    color: #333;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
`;

const characterImageStyle = css`
    width: 60px;
    margin-bottom: 18px;
`;

const textStyle = css`
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.descriptionText};
`;

const buttonContainer = css`
    height: 45px;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-top: 1px solid ${theme.colors.borderColor};
`;

const buttonStyle = css`
    padding: 6px 8px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0 5px;
    background-color: ${theme.colors.darkGray};
    color: ${theme.colors.white};
`;

export default HomeBorderPass;
