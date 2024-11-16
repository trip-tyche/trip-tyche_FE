import { css } from '@emotion/react';
import { IoAirplaneSharp } from 'react-icons/io5';

import characterImg from '@/assets/images/character-1.png';
import { useTicket3DEffect } from '@/hooks/useTicket3DEffect';
import theme from '@/styles/theme';
import { FormattedTripDate } from '@/types/trip';
import { formatDateToDot } from '@/utils/date';

interface IntroTicketProps {
    trip: FormattedTripDate;
    userNickname: string;
}

const IntroTicket = ({ trip, userNickname }: IntroTicketProps) => {
    const { tripTitle, country, startDate, endDate, hashtags } = trip;

    const { ticketStyle, handlers } = useTicket3DEffect();

    return (
        <article
            css={[ticketContainer, interactionTicketStyle]}
            style={ticketStyle}
            onMouseMove={handlers.handleMouseMove}
            onMouseLeave={handlers.handleMouseLeave}
            onTouchStart={handlers.handleTouchStart}
            onTouchMove={handlers.handleTouchMove}
            onTouchEnd={handlers.handleTouchEnd}
        >
            <section css={leftContent}>
                <header css={leftTopSection}>
                    <div>
                        <div css={labelStyle}>PASSENGER</div>
                        <div css={valueStyle}>{userNickname}</div>
                    </div>
                    <div>
                        <div css={labelStyle}>DATE</div>
                        <p css={valueStyle}>{formatDateToDot(startDate)}</p>
                    </div>
                    <div>
                        <div css={labelStyle}>DATE</div>
                        <p css={valueStyle}>{formatDateToDot(endDate)}</p>
                    </div>
                </header>

                <main css={contentContainer}>
                    <div css={citiesStyle}>
                        <span>INCHEON</span>
                        <IoAirplaneSharp />
                        <span>{country.substring(4)}</span>
                    </div>
                    <div css={titleStyle}>
                        <h3 css={titleLabelStyle}>Title</h3>
                        <h2 css={titleValueStyle}>{tripTitle}</h2>
                    </div>
                    <div css={hashtagGroup}>
                        {hashtags.map((tag, index) => (
                            <span key={index} css={hashtagStyle}>
                                # {tag}
                            </span>
                        ))}
                    </div>
                </main>
            </section>

            <aside css={rightSection}>
                <div css={rightTopSection}>
                    <div css={labelStyle}>FLIGHT</div>
                    <div css={valueStyle}>TYCHE AIR</div>
                </div>
                <div css={rightContent}>
                    <img css={imageStyle} src={characterImg} alt='캐릭터' />
                    <p css={textStyle}>Click Ticket</p>
                </div>
            </aside>
        </article>
    );
};

const interactionTicketStyle = css`
    touch-action: none;
    box-shadow:
        0 6px 8px rgba(0, 0, 0, 0.1),
        0 1px 3px rgba(0, 0, 0, 0.08);
`;

const ticketContainer = css`
    width: 100%;
    max-width: 428px;
    position: relative;
    display: flex;
    border-radius: 10px;
    margin-bottom: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
`;

const leftContent = css`
    width: 75%;
    background: ${theme.colors.modalBg};
    background: white;
    border-right: 1px solid ${theme.colors.borderColor};
`;

const leftTopSection = css`
    display: flex;
    justify-content: space-between;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.modalBg};
    padding: 10px 12px;
`;

const labelStyle = css`
    font-size: ${theme.fontSizes.small_12};
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 4px;
`;

const valueStyle = css`
    font-size: ${theme.fontSizes.small_12};
    font-weight: bold;
`;

const contentContainer = css`
    padding: 12px;
`;

const citiesStyle = css`
    display: flex;
    justify-content: space-between;
    font-size: ${theme.fontSizes.xxlarge_20};
    font-weight: bold;
`;

const titleStyle = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 18px 0 22px 2px;
`;

const titleLabelStyle = css`
    font-size: ${theme.fontSizes.small_12};
    font-weight: bold;
`;

const titleValueStyle = css`
    font-weight: bold;
`;

const hashtagGroup = css`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
`;

const hashtagStyle = css`
    background-color: #f0f0f0;
    color: ${theme.colors.black};
    padding: 5px 10px;
    border-radius: 15px;
    font-size: ${theme.fontSizes.small_12};
`;

const rightSection = css`
    width: 25%;
    background: ${theme.colors.modalBg};
`;

const rightTopSection = css`
    padding: 10px 12px;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.modalBg};
`;

const rightContent = css`
    height: calc(100% - 48px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    background: ${theme.colors.modalBg};
`;

const imageStyle = css`
    width: 55px;
`;

const textStyle = css`
    font-size: ${theme.fontSizes.normal_14};
    font-weight: 600;
    color: ${theme.colors.descriptionText};
`;

export default IntroTicket;
