import { useState } from 'react';

import { css, keyframes } from '@emotion/react';
import { ImagePlus, Share2 } from 'lucide-react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { IoAirplaneSharp } from 'react-icons/io5';

import characterImg from '@/assets/images/character-ogami-1.png';
import Spinner from '@/components/common/Spinner';
import ConfirmModal from '@/components/guide/ConfirmModal';
import InputModal from '@/components/guide/InputModal';
import { COLORS } from '@/constants/theme';
import { useTripShare } from '@/domains/share/hooks/useTripShare';
import { TICKET } from '@/domains/trip/constants';
import { Trip } from '@/domains/trip/types';
import useUserStore from '@/domains/user/stores/useUserStore';
import { useTicketHandler } from '@/hooks/useTicketHandler';
import { useTicketNavigation } from '@/hooks/useTicketNavigation';
import { formatToDot } from '@/libs/utils/date';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';

interface TripTicketProps {
    tripInfo: Trip;
}

const TripTicket = ({ tripInfo }: TripTicketProps) => {
    const { tripKey, tripTitle, country, startDate, endDate, hashtags, ownerNickname } = tripInfo;

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const { showToast } = useToastStore.getState();

    const userInfo = useUserStore((state) => state.userInfo);

    const { isSharing, error, shareTrip, clearError } = useTripShare(inputValue, tripKey!, onShareSuccess);
    const { isModalOpen, isPending, handler, deleteTrip, closeModal } = useTicketHandler(tripKey!, {
        onSuccess: (message) => showToast(message),
        onError: (message) => showToast(message),
    });
    const { isAnimating, handleCardClick } = useTicketNavigation(tripKey!);

    function onShareSuccess() {
        setIsShareModalOpen(false);
        showToast(`'${inputValue}'님께 여행 공유를 요청했습니다`);
    }

    const isOwner = userInfo?.nickname === ownerNickname;

    return (
        <div css={ticketContainer}>
            {isPending && <Spinner />}
            <article css={ticketStyle} onClick={handleCardClick}>
                <section css={leftSection}>
                    <header css={leftTopSection(isOwner)}>
                        <div>
                            <h3 css={labelStyle}>PASSENGER</h3>
                            <p css={valueStyle}>{ownerNickname}</p>
                        </div>
                        <div>
                            <h3 css={labelStyle}>DATE</h3>
                            <p css={valueStyle}>{formatToDot(startDate)}</p>
                        </div>
                        <div>
                            <h3 css={labelStyle}>DATE</h3>
                            <p css={valueStyle}>{formatToDot(endDate)}</p>
                        </div>
                    </header>

                    <main css={contentContainer}>
                        <div css={citiesStyle}>
                            <p>{TICKET.DEFAULT_COUNTY}</p>
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

                <aside css={[rightSection, isAnimating && animateRight]}>
                    <header css={rightTopSection(isOwner)}>
                        <h3 css={labelStyle}>FLIGHT</h3>
                        <p css={valueStyle}>TYCHE AIR</p>
                    </header>
                    <div css={rightContent}>
                        <img css={imageStyle} src={characterImg} alt='캐릭터' />
                    </div>
                </aside>
            </article>

            <footer css={buttonGroup}>
                <button css={buttonStyle} onClick={() => handler.edit()}>
                    <FaPencilAlt size={14} /> 티켓 수정
                </button>
                <button css={buttonStyle} onClick={() => handler.images()}>
                    <ImagePlus size={16} /> 사진 관리
                </button>
                {isOwner && (
                    <button css={buttonStyle} onClick={() => setIsShareModalOpen(true)}>
                        <Share2 size={16} /> 티켓 공유
                    </button>
                )}
                <button css={buttonStyle} onClick={() => handler.delete()}>
                    <FaTrashAlt size={14} /> 티켓 삭제
                </button>
            </footer>

            {isModalOpen && (
                <ConfirmModal
                    title='여행 티켓을 삭제하시겠습니까?'
                    description='여행 티켓을 삭제하면 해당 여행의 정보와 사진들은 다시 복구할 수 없습니다. 그래도 삭제하시겠습니까?'
                    confirmText='삭제'
                    cancelText='취소'
                    confirmModal={deleteTrip}
                    closeModal={closeModal}
                />
            )}

            {isShareModalOpen && (
                <InputModal
                    error={error}
                    value={inputValue}
                    onChange={(inputValue) => setInputValue(inputValue)}
                    title='티켓 공유하기'
                    description='함께 여행 티켓을 관리할 친구를 추가해 보세요! 친구에게 초대 알림이 전송됩니다'
                    confirmText='공유하기'
                    cancelText='취소'
                    confirmModal={shareTrip}
                    closeModal={() => {
                        setIsShareModalOpen(false);
                        setInputValue('');
                        clearError();
                    }}
                    disabled={isSharing || inputValue.trim().length === 0}
                    placeholder='친구의 닉네임을 입력해주세요'
                />
            )}
        </div>
    );
};

const ticketContainer = css`
    margin-bottom: 12px;
`;

const ticketStyle = css`
    width: 100%;
    height: 192px;
    max-width: 428px;
    position: relative;
    display: flex;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
`;

const leftSection = css`
    width: 75%;
    height: 100%;
    background: ${theme.COLORS.BACKGROUND.WHITE};
    border-right: 1px solid ${theme.COLORS.BORDER};
    border-radius: 10px 0 0 10px;
    box-shadow:
        -6px 6px 8px rgba(0, 0, 0, 0.1),
        -1px 1px 3px rgba(0, 0, 0, 0.08);
`;

const leftTopSection = (isOwner: boolean) => css`
    height: 48px;
    display: flex;
    justify-content: space-between;
    border-radius: 10px 0 0 0;
    background-color: ${isOwner ? theme.COLORS.PRIMARY : theme.COLORS.SECONDARY};
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
    height: 100%;
    background: ${theme.COLORS.BACKGROUND.WHITE};
    border-radius: 0 10px 10px 0;
    box-shadow:
        6px 6px 8px rgba(0, 0, 0, 0.1),
        1px 1px 3px rgba(0, 0, 0, 0.08);
`;

const rightTopSection = (isOwner: boolean) => css`
    height: 48px;
    padding: 10px 12px;
    background-color: ${isOwner ? theme.COLORS.PRIMARY : theme.COLORS.SECONDARY};
    color: ${theme.COLORS.TEXT.WHITE};
    border-radius: 0 10px 0 0;
`;

const rightContent = css`
    height: calc(100% - 48px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 28px;
    background-color: ${theme.COLORS.BACKGROUND.WHITE};
    border-radius: 0 0 10px 0;
`;

const imageStyle = css`
    width: 52px;
`;

const slideRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
      transform: translateX(100%);
    }
    `;

const animateRight = css`
    animation: ${slideRight} 0.8s forwards;
`;

const buttonGroup = css`
    display: flex;
    justify-content: space-between;
    padding: 8px;
    border-bottom: 1.5px dashed ${COLORS.TEXT.DESCRIPTION}50;
`;

const buttonStyle = css`
    display: flex;
    align-items: center;
    padding: 6px 8px;
    border: none;
    border-radius: 4px;
    font-size: ${theme.FONT_SIZES.SM};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    gap: 4px;
    background: transparent;
    color: ${theme.COLORS.TEXT.BLACK};
`;

export default TripTicket;
