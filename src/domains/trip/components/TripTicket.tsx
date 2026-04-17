import { useState } from 'react';

import { css } from '@emotion/react';
import { ImagePlus, Share2, Edit, Trash, Unlink, Info, Plus } from 'lucide-react';

import characterImg from '@/assets/images/character-icon.png';
import ShareModal from '@/domains/share/components/ShareModal';
import { TICKET } from '@/domains/trip/constants';
import { Trip } from '@/domains/trip/types';
import useUserStore from '@/domains/user/stores/useUserStore';
import { formatHyphenToDot, formatToDot } from '@/libs/utils/date';
import ConfirmModal from '@/shared/components/common/Modal/ConfirmModal';
import Indicator from '@/shared/components/common/Spinner/Indicator';
import { COLORS } from '@/shared/constants/style';
import { useTicketHandler } from '@/shared/hooks/useTicketHandler';
import { useTicketNavigation } from '@/shared/hooks/useTicketNavigation';
import { useToastStore } from '@/shared/stores/useToastStore';

const TripTicket = ({ tripInfo }: { tripInfo: Trip }) => {
    const {
        tripKey,
        tripTitle,
        country,
        startDate,
        endDate,
        hashtags,
        ownerNickname,
        sharedUsersNicknames,
        shareId,
        confirmed: isCompletedTrip,
    } = tripInfo;

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const showToast = useToastStore((state) => state.showToast);

    const userInfo = useUserStore((state) => state.userInfo);

    const { isModalOpen, isDeleting, isUnLinking, handler, deleteTrip, unlinkShared, closeModal } = useTicketHandler(
        tripKey!,
        {
            onSuccess: (message) => showToast(message),
            onError: (message) => showToast(message),
        },
    );
    const { isAnimating, handleCardClick } = useTicketNavigation(tripKey!);

    if (isCompletedTrip === undefined) return null;

    const isOwner = userInfo?.nickname === ownerNickname;
    const countryEmoji = isCompletedTrip ? country.split('/')[0] || '' : '';
    const destination = isCompletedTrip ? country.split('/')[1] || '' : '트립티케';
    const formattedStartDate = isCompletedTrip ? formatToDot(startDate) : '2000-01-01';
    const formattedEndDate = isCompletedTrip ? formatToDot(endDate) : '2000-01-01';
    const formattedTitle = isCompletedTrip ? tripTitle : '여행이 아직 완성되지 않았어요';
    const sharedPeople = [ownerNickname || '', ...(sharedUsersNicknames || [])];

    return (
        <div css={container}>
            {isDeleting && <Indicator text='여행 티켓 삭제 중...' />}
            {isUnLinking && <Indicator text='공유 티켓 삭제 중...' />}

            {!isCompletedTrip && (
                <div css={isUncompletedTripOverlayStyle}>
                    <div css={isUncompletedTripButtonStyle}>
                        <button
                            css={css`
                                padding: 10px 12px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                gap: 6px;
                                color: ${COLORS.TEXT.DESCRIPTION};
                                background: none;
                                border: none;
                                cursor: pointer;
                            `}
                            onClick={() => handler.edit(isCompletedTrip)}
                            aria-label="여행 정보 이어서 작성하기"
                        >
                            <Plus size={14} aria-hidden="true" /> 여행 정보 이어서 작성하기
                        </button>

                        <div css={buttonSeparator} aria-hidden="true" />

                        <button
                            css={css`
                                padding: 10px 12px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                gap: 6px;
                                border: none;
                                color: ${COLORS.TEXT.ERROR};
                                background: none;
                                cursor: pointer;
                            `}
                            onClick={() => handler.delete()}
                            aria-label="삭제하기"
                        >
                            <Trash size={14} aria-hidden="true" /> 삭제하기
                        </button>
                    </div>
                </div>
            )}

            <main css={mainStyle} onClick={handleCardClick}>
                <header css={header(isOwner)}>
                    <div css={headerItem}>
                        <h3 css={labelStyle}>PASSENGER</h3>
                        <p css={valueStyle}>{ownerNickname}</p>
                    </div>
                    <div css={headerItem}>
                        <h3 css={labelStyle}>DEPART</h3>
                        <p css={valueStyle}>{formattedStartDate}</p>
                    </div>
                    <div css={headerItem}>
                        <h3 css={labelStyle}>RETURN</h3>
                        <p css={valueStyle}>{formattedEndDate}</p>
                    </div>
                    <div css={headerItem}>
                        <h3 css={labelStyle}>FLIGHT</h3>
                        <p css={valueStyle}>TYCHE AIR</p>
                    </div>
                </header>

                <div css={perforationStyle} />

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
                        <p css={titleValueStyle}>{formattedTitle}</p>
                    </div>

                    <div css={contentFooter}>
                        <div css={hashtagGroup}>
                            {hashtags
                                .filter((tag) => tag !== '')
                                .map((tag, index) => (
                                    <span key={index} css={hashtagStyle}>
                                        <span css={hashSymbol}>#</span> {tag}
                                    </span>
                                ))}
                        </div>
                        <div css={flagStyle(isOwner)}>{countryEmoji}</div>
                    </div>
                </div>
            </main>

            <footer css={buttonGroup}>
                <button css={buttonStyle} onClick={() => handler.edit(isCompletedTrip)}>
                    <Edit size={14} aria-hidden="true" />
                    {isOwner ? '티켓 수정' : '정보 보기'}
                </button>
                <button css={buttonStyle} onClick={() => handler.images()}>
                    <ImagePlus size={16} aria-hidden="true" />
                    {isOwner ? '사진 관리' : '사진 보기'}
                </button>
                {isOwner ? (
                    <button css={buttonStyle} onClick={() => setIsShareModalOpen(true)}>
                        <Share2 size={16} aria-hidden="true" /> 티켓 공유
                    </button>
                ) : (
                    <button css={buttonStyle} onClick={() => setIsShareModalOpen(true)}>
                        <Info size={16} aria-hidden="true" /> 공유 정보
                    </button>
                )}
                {isOwner ? (
                    <button css={[buttonStyle, deleteButtonStyle]} onClick={() => handler.delete()}>
                        <Trash size={14} aria-hidden="true" /> 티켓 삭제
                    </button>
                ) : (
                    <button css={[buttonStyle, deleteButtonStyle]} onClick={() => handler.delete()}>
                        <Unlink size={14} aria-hidden="true" /> 공유 해제
                    </button>
                )}
            </footer>

            {isModalOpen && (
                <ConfirmModal
                    title={isOwner ? '여행 티켓을 삭제하시겠습니까?' : '공유를 해제하시겠습니까?'}
                    description={
                        isOwner
                            ? '여행 티켓을 삭제하면 해당 여행의 정보와 사진들은 다시 복구할 수 없습니다. 그래도 삭제하시겠습니까?'
                            : '공유를 해제하면 더 이상 이 여행 티켓에 접근할 수 없게 됩니다. 계속하시겠습니까?'
                    }
                    confirmText={isOwner ? '삭제' : '해제'}
                    cancelText='취소'
                    confirmModal={isOwner ? deleteTrip : () => unlinkShared(shareId!)}
                    closeModal={closeModal}
                />
            )}

            {isShareModalOpen && (
                <ShareModal
                    tripKey={tripKey!}
                    tripTitle={tripTitle}
                    isOwner={isOwner}
                    sharedPeople={sharedPeople}
                    startDate={formatHyphenToDot(startDate)}
                    endDate={formatHyphenToDot(endDate)}
                    onClose={() => setIsShareModalOpen(false)}
                />
            )}
        </div>
    );
};

const container = css`
    width: 100%;
    margin-bottom: 8px;
    position: relative;
    transition: box-shadow 0.25s ease;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.06);
    border-radius: 16px;
    overflow: hidden;
    user-select: none;
`;

const isUncompletedTripOverlayStyle = css`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.48);
    z-index: 9;
    cursor: pointer;
`;

const isUncompletedTripButtonStyle = css`
    display: flex;
    align-items: center;
    gap: 6px;
    color: #1d1d1f;
    background-color: #ffffff;
    border: none;
    border-radius: 24px;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.22) 3px 5px 30px 0px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.224px;
`;

const mainStyle = css`
    cursor: pointer;
`;

const header = (isOwner: boolean) => css`
    display: flex;
    justify-content: space-around;
    background: ${isOwner
        ? 'linear-gradient(135deg, #0071e3 0%, #0055d4 100%)'
        : 'linear-gradient(135deg, #0055d4 0%, #003fa3 100%)'};
    color: #ffffff;
    padding: 12px 0;
    position: relative;
    overflow: hidden;
`;

const perforationStyle = css`
    height: 1px;
    background: repeating-linear-gradient(
        to right,
        rgba(0, 0, 0, 0.1) 0,
        rgba(0, 0, 0, 0.1) 6px,
        transparent 6px,
        transparent 12px
    );
    margin: 0 16px;
`;

const headerItem = css`
    display: flex;
    flex-direction: column;
`;

const labelStyle = css`
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 4px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
`;

const valueStyle = css`
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.2px;
    color: #ffffff;
`;

const contentStyle = css`
    width: 100%;
    padding: 20px 20px 14px;
    display: flex;
    flex-direction: column;
    background: #ffffff;
`;

const citiesStyle = css`
    display: flex;
    align-items: center;
`;

const countryNameStyle = css`
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: #0f172a;
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
    height: 1px;
    background: rgba(0, 113, 227, 0.15);
`;

const startPointDot = css`
    position: absolute;
    left: 0;
    top: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #0071e3;
    opacity: 0.4;
    transform: translateY(-50%);
`;

const endPointDot = css`
    position: absolute;
    right: 0;
    top: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #0071e3;
    opacity: 0.4;
    transform: translateY(-50%);
`;

const characterContainer = (isHovered: boolean) => css`
    width: 40px;
    height: 40px;
    position: absolute;
    left: 0;
    transform: translateX(${isHovered ? '80%' : '0%'});
    transition: transform 1s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
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
    margin: 20px 0 -8px 4px;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const titleLabelStyle = css`
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: rgba(15, 23, 42, 0.4);
`;

const titleValueStyle = css`
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.3px;
    color: #0f172a;
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
    background: rgba(0, 113, 227, 0.06);
    color: #0055d4;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.12px;
    border: 1px solid rgba(0, 113, 227, 0.12);
`;

const hashSymbol = css`
    color: #0071e3;
    font-weight: 700;
`;

const flagStyle = (isOwner: boolean) => css`
    padding: 4px 8px;
    background-color: ${isOwner ? 'rgba(0, 113, 227, 0.08)' : '#f5f5f7'};
    border: 1px solid ${isOwner ? 'rgba(0, 113, 227, 0.2)' : 'rgba(0,0,0,0.1)'};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
`;

const buttonGroup = css`
    display: flex;
    justify-content: space-between;
    background: #f8fafc;
    padding: 10px 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    transition: background 0.25s ease;
`;

const buttonStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.12px;
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
    gap: 5px;
    background: transparent;
    color: #64748b;
    -webkit-tap-highlight-color: transparent;

    @media (hover: hover) {
        &:hover {
            color: #0071e3;
            background: rgba(0, 113, 227, 0.06);
        }
    }
    &:active {
        color: #0055d4;
        opacity: 0.8;
    }
`;

const deleteButtonStyle = css`
    margin-left: auto;
    color: ${COLORS.TEXT.ERROR};

    @media (hover: hover) {
        &:hover {
            color: ${COLORS.TEXT.ERROR};
            background: rgba(239, 68, 68, 0.06);
        }
    }
    &:active {
        color: ${COLORS.TEXT.ERROR};
        opacity: 0.7;
    }
`;

const buttonSeparator = css`
    width: 1px;
    height: 60%;
    background: ${COLORS.BORDER};
    align-self: center;
    flex-shrink: 0;
`;

export default TripTicket;
