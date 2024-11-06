import { css, keyframes } from '@emotion/react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';

import characterImg from '/public/ogami_1.png';

import theme from '@/styles/theme';
import { FormattedTripDate } from '@/types/trip';

interface BorderPassProps {
    trip: FormattedTripDate;
    userNickname: string;
}

const HomeBorderPass = ({ trip, userNickname }: BorderPassProps): JSX.Element => {
    const { tripTitle, country, startDate, endDate, hashtags } = trip;

    return (
        <div css={borderPassContainer}>
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
                            <div>✈</div>
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
                        <button css={buttonStyle}>
                            <FiPlus /> Upload
                        </button>
                        <button css={buttonStyle}>
                            <FaPencilAlt /> Edit
                        </button>
                        <button css={buttonStyle}>
                            <FaTrashAlt /> Delete
                        </button>
                    </div>
                </div>
                <div css={[rightSection]}>
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
    margin-bottom: 20px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
    padding: 10px 15px;
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
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    border-top: 1px solid ${theme.colors.borderColor};
`;

const buttonStyle = css`
    padding: 6px 8px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0 5px;
    background-color: ${theme.colors.darkGray};
    color: ${theme.colors.white};
`;

export default HomeBorderPass;
