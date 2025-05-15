import { useState } from 'react';

import { css } from '@emotion/react';
import { ImagePlus, Share2, Edit, Trash, Unlink, Info, Touchpad } from 'lucide-react';

import characterImg from '@/assets/images/character-ogami-1.png';
import ShareModal from '@/domains/share/components/ShareModal';
import { TICKET } from '@/domains/trip/constants';
import { Trip } from '@/domains/trip/types';
import useUserStore from '@/domains/user/stores/useUserStore';
import { formatHyphenToDot, formatToDot } from '@/libs/utils/date';
import Spinner from '@/shared/components/common/Spinner';
import ConfirmModal from '@/shared/components/guide/ConfirmModal';
import { COLORS, FONT_SIZES } from '@/shared/constants/theme';
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
        shareId,
        confirmed: isCompletedTrip,
    } = tripInfo;

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const { showToast } = useToastStore.getState();

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
    const formattedStartDate = isCompletedTrip ? formatToDot(startDate) : '2025-01-01';
    const formattedEndDate = isCompletedTrip ? formatToDot(endDate) : '2025-01-01';
    const formattedTitle = isCompletedTrip ? tripTitle : '여행이 아직 완성되지 않았어요...';

    return (
        <div css={container}>
            {isDeleting && <Spinner text='여행 티켓 삭제 중...' />}
            {isUnLinking && <Spinner text='공유 티켓 삭제 중...' />}
            {!isCompletedTrip && (
                <div css={isUncompletedTripOverlayStyle}>
                    <button css={isUncompletedTripButtonStyle} onClick={() => handler.edit(isCompletedTrip)}>
                        <Touchpad size={20} /> 여행 정보 이어서 작성하기
                    </button>
                </div>
            )}

            <main css={mainStyle} onClick={handleCardClick}>
                <header css={header(isOwner)}>
                    <div css={headerItem}>
                        <h3 css={labelStyle}>PASSENGER</h3>
                        <p css={valueStyle}>{ownerNickname}</p>
                    </div>
                    <div css={headerItem}>
                        <h3 css={labelStyle}>DATE</h3>
                        <p css={valueStyle}>{formattedStartDate}</p>
                    </div>
                    <div css={headerItem}>
                        <h3 css={labelStyle}>DATE</h3>
                        <p css={valueStyle}>{formattedEndDate}</p>
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
                    <Edit size={14} />
                    {isOwner ? '티켓 수정' : '정보 보기'}
                </button>
                <button css={buttonStyle} onClick={() => handler.images()}>
                    <ImagePlus size={16} />
                    {isOwner ? '사진 관리' : '사진 보기'}
                </button>
                {isOwner ? (
                    <button css={buttonStyle} onClick={() => setIsShareModalOpen(true)}>
                        <Share2 size={16} /> 티켓 공유
                    </button>
                ) : (
                    <button css={buttonStyle} onClick={() => console.log('공유 정보')}>
                        <Info size={16} /> 공유 정보
                    </button>
                )}
                {isOwner ? (
                    <button css={buttonStyle} onClick={() => handler.delete()}>
                        <Trash size={14} /> 티켓 삭제
                    </button>
                ) : (
                    <button css={buttonStyle} onClick={() => handler.delete()}>
                        <Unlink size={14} /> 공유 해제
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
    transition: all 0.25s ease;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.06),
        0 2px 4px -1px rgba(0, 0, 0, 0.08);
    border-radius: 14px;
    overflow: hidden;
    user-select: none;
`;

const isUncompletedTripOverlayStyle = () => css`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${`${COLORS.BACKGROUND.ICON}70`};
    z-index: 9999;
    cursor: pointer;
`;

const isUncompletedTripButtonStyle = () => css`
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: ${COLORS.BACKGROUND.WHITE};
    border: none;
    border-radius: 24px;
    cursor: pointer;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.06),
        0 2px 4px -1px rgba(0, 0, 0, 0.08);
`;

const mainStyle = css`
    cursor: pointer;
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

const contentStyle = () => css`
    width: 100%;
    padding: 16px 16px 12px 16px;
    display: flex;
    flex-direction: column;
    background: ${COLORS.BACKGROUND.WHITE_SECONDARY};
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

const buttonGroup = css`
    display: flex;
    justify-content: space-between;
    background-color: white;
    padding: 10px 12px;
    border-radius: 0 0 14px 14px;
    border: 1px solid #f3f4f6;
    border-top: none;
    transition: all 0.25s ease;
`;

const buttonStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    gap: 6px;
    background: transparent;
    color: #4b5563;
    transition: color 0.2s ease;

    &:hover {
        color: ${COLORS.PRIMARY_HOVER};
    }
`;

export default TripTicket;
