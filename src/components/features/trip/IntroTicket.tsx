import { css } from '@emotion/react';
import { IoAirplaneSharp } from 'react-icons/io5';

import characterImg from '@/assets/images/character-1.png';
import { useTicket3DEffect } from '@/hooks/useTicket3DEffect';
import theme from '@/styles/theme';
import { TripModel } from '@/types/trip';
import { formatToDot } from '@/utils/date';

interface IntroTicketProps {
    trip: TripModel;
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
                        <p css={valueStyle}>{formatToDot(startDate)}</p>
                    </div>
                    <div>
                        <div css={labelStyle}>DATE</div>
                        <p css={valueStyle}>{formatToDot(endDate)}</p>
                    </div>
                </header>

                <main css={contentContainer}>
                    <div css={citiesStyle}>
                        <p>대한민국</p>
                        <IoAirplaneSharp />
                        <p>{country.split('/')[1]}</p>
                    </div>
                    <div css={contentStyle}>
                        <div css={titleStyle}>
                            <p css={titleLabelStyle}>Title</p>
                            <p css={titleValueStyle}>{tripTitle}</p>
                        </div>
                        <p css={flagStyle}>{country.split('/')[0]}</p>
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
                    <p css={textStyle}>Move Ticket</p>
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
    margin-bottom: 24px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
`;

const leftContent = css`
    width: 75%;
    background: ${theme.COLORS.BACKGROUND.WHITE};
    border-right: 1px solid ${theme.COLORS.BORDER};
`;

const leftTopSection = css`
    display: flex;
    justify-content: space-between;
    background-color: ${theme.COLORS.PRIMARY};
    color: ${theme.COLORS.TEXT.WHITE};
    padding: 10px 12px;
`;

const labelStyle = css`
    font-size: ${theme.FONT_SIZES.SM};
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 4px;
`;

const valueStyle = css`
    font-size: ${theme.FONT_SIZES.SM};
    font-weight: bold;
`;

const contentContainer = css`
    padding: 12px;
`;

const citiesStyle = css`
    display: flex;
    justify-content: space-between;
    font-size: ${theme.FONT_SIZES.XXL};
    font-weight: bold;
`;

const contentStyle = css`
    margin: 18px 0 22px 2px;
    display: flex;
    justify-content: space-between;
`;

const titleStyle = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const titleLabelStyle = css`
    font-size: ${theme.FONT_SIZES.SM};
    font-weight: bold;
`;

const titleValueStyle = css`
    font-weight: bold;
`;

const flagStyle = css`
    display: flex;
    align-items: center;
    margin-right: 4px;
    font-size: ${theme.FONT_SIZES.XL};
`;

const hashtagGroup = css`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
`;

const hashtagStyle = css`
    background-color: #f0f0f0;
    color: ${theme.COLORS.TEXT.BLACK};
    padding: 5px 10px;
    border-radius: 15px;
    font-size: ${theme.FONT_SIZES.SM};
`;

const rightSection = css`
    width: 25%;
    background: ${theme.COLORS.BACKGROUND.WHITE};
`;

const rightTopSection = css`
    padding: 10px 12px;
    background-color: ${theme.COLORS.PRIMARY};
    color: ${theme.COLORS.TEXT.WHITE};
`;

const rightContent = css`
    height: calc(100% - 48px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    background: ${theme.COLORS.BACKGROUND.WHITE};
`;

const imageStyle = css`
    width: 55px;
`;

const textStyle = css`
    font-size: ${theme.FONT_SIZES.MD};
    font-weight: 600;
    color: ${theme.COLORS.TEXT.DESCRIPTION};
`;

export default IntroTicket;
