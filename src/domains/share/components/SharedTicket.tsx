import { useEffect, useState } from 'react';

import { css } from '@emotion/react';

import characterImg from '@/assets/images/character-ogami-1.png';
import { SharedTripDetail } from '@/domains/share/types';
import { TICKET } from '@/domains/trip/constants';
import { formatToDot } from '@/libs/utils/date';
import { COLORS, FONT_SIZES } from '@/shared/constants/style';

interface IntroTicketProps {
    trip: SharedTripDetail;
    userNickname: string;
}

const SharedTicket = ({ trip, userNickname }: IntroTicketProps) => {
    const { tripTitle, country, startDate, endDate, hashtags } = trip;
    const [isAnimating, setIsAnimating] = useState(false);

    const countryEmoji = country.split('/')[0] || '';
    const destination = country.split('/')[1] || '';

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(true);
        }, 200);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div css={container}>
            <main css={mainStyle}>
                <header css={header(true)}>
                    <div css={headerItem}>
                        <h3 css={labelStyle}>PASSENGER</h3>
                        <p css={valueStyle}>{userNickname}</p>
                    </div>
                    <div css={headerItem}>
                        <h3 css={labelStyle}>DATE</h3>
                        <p css={valueStyle}>{formatToDot(startDate)}</p>
                    </div>
                    <div css={headerItem}>
                        <h3 css={labelStyle}>DATE</h3>
                        <p css={valueStyle}>{formatToDot(endDate)}</p>
                    </div>
                    <div css={headerItem}>
                        <h3 css={labelStyle}>FLIGHT</h3>
                        <p css={valueStyle}>TYCHE AIR</p>
                    </div>
                </header>

                <div css={contentStyle}>
                    <div css={citiesStyle}>
                        <p css={countryNameStyle}>{TICKET.DEFAULT_COUNTY}</p>
                        <div css={dotsAndCharacterContainer}>
                            <div css={pointDots}>
                                <div css={startPointDot} />
                                <div css={endPointDot} />
                            </div>
                            <div css={characterContainer(isAnimating)}>
                                <img css={characterStyle} src={characterImg} alt='캐릭터' />
                                <div css={characterShadow}></div>
                            </div>
                        </div>
                        <p css={countryNameStyle}>{destination}</p>
                    </div>

                    <div css={titleStyle}>
                        <p css={titleLabelStyle}>Title</p>
                        <p css={titleValueStyle}>{tripTitle}</p>
                    </div>

                    <div css={contentFooter}>
                        <div css={hashtagGroup}>
                            {hashtags.map((tag, index) => (
                                <span key={index} css={hashtagStyle}>
                                    <span css={hashSymbol}>#</span> {tag}
                                </span>
                            ))}
                        </div>
                        <div css={flagStyle(true)}>{countryEmoji}</div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const container = css`
    margin-bottom: 8px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.08));
    transition: all 0.25s ease;
`;

const mainStyle = css`
    width: 100%;
    border-radius: 14px 14px 0 0;
    cursor: pointer;
    overflow: hidden;
`;

const header = (isOwner: boolean) => css`
    display: flex;
    justify-content: space-around;
    background: ${isOwner ? COLORS.PRIMARY : '#4b5563'};
    color: ${COLORS.BACKGROUND.WHITE};
    padding: 12px 0;
    position: relative;
    overflow: hidden;
`;

const headerItem = css`
    display: flex;
    flex-direction: column;
`;

const labelStyle = css`
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 4px;
    font-weight: 500;
`;

const valueStyle = css`
    font-size: 12px;
    font-weight: 600;
`;

const contentStyle = css`
    width: 100%;
    padding: 16px 16px 12px 16px;
    display: flex;
    flex-direction: column;
    background: ${COLORS.BACKGROUND.WHITE_SECONDARY};
    border-radius: 0 0 14px 14px;
`;

const citiesStyle = css`
    display: flex;
    align-items: center;
`;

const countryNameStyle = css`
    font-size: 18px;
    font-weight: 700;
    color: ${COLORS.TEXT.BLACK};
`;

const dotsAndCharacterContainer = css`
    flex: 1;
    position: relative;
    margin: 0 12px;
    display: flex;
    align-items: center;
`;

const pointDots = css`
    width: 100%;
    height: 2px;
    background: #9ca3af;
`;

const startPointDot = css`
    position: absolute;
    left: 0;
    top: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #9ca3af;
    transform: translateY(-50%);
`;

const endPointDot = css`
    position: absolute;
    right: 0;
    top: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #9ca3af;
    transform: translateY(-50%);
`;

const characterContainer = (isHovered: boolean) => css`
    width: 40px;
    height: 40px;
    position: absolute;
    left: ${isHovered ? '80%' : '0%'};
    transition: all 1s ease;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const characterStyle = css`
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 2;
`;

const characterShadow = css`
    position: absolute;
    bottom: -6px;
    width: 30px;
    height: 6px;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
    border-radius: 50%;
    z-index: 1;
`;

const titleStyle = css`
    margin: 24px 0 -8px 4px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const titleLabelStyle = css`
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
`;

const titleValueStyle = css`
    font-size: 14px;
    font-weight: 600;
    color: #111827;
`;

const contentFooter = css`
    display: flex;
    justify-content: space-between;
    align-items: end;
`;

const hashtagGroup = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
`;

const hashtagStyle = css`
    background-color: #f0f0f0;
    color: ${COLORS.TEXT.BLACK};
    color: #4b5563;
    padding: 5px 10px;
    border-radius: 9999px;
    font-size: ${FONT_SIZES.SM};
`;

const hashSymbol = css`
    color: ${COLORS.PRIMARY};
    font-weight: 700;
`;

const flagStyle = (isOwner: boolean) => css`
    padding: 4px 8px;
    background-color: ${isOwner ? '#eff6ff' : '#f1f5f9'};
    border: 1px solid ${isOwner ? '#dbeafe' : '#e2e8f0'};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    font-size: 36px;
`;

export default SharedTicket;
