import { useState } from 'react';

import { css, keyframes } from '@emotion/react';
import { AxiosError } from 'axios';
import { ImagePlus, Bell } from 'lucide-react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { IoAirplaneSharp } from 'react-icons/io5';

import { shareAPI } from '@/api/trips/share';
import characterImg from '@/assets/images/character-ogami-1.png';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import InputModal from '@/components/features/guide/InputModal';
import { useTicketHandler } from '@/hooks/useTicketHandler';
import { useTicketNavigation } from '@/hooks/useTicketNavigation';
import { useToastStore } from '@/stores/useToastStore';
import theme from '@/styles/theme';
import { TripModel } from '@/types/trip';
import { formatToDot } from '@/utils/date';

interface TripTicketProps {
    trip: TripModel;
    userNickname: string;
}

const TripTicket = ({ trip, userNickname }: TripTicketProps) => {
    const { tripId, tripTitle, country, startDate, endDate, hashtags } = trip;

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToastStore.getState();

    const { isModalOpen, handleImageUpload, handleTripEdit, handleTripDelete, deleteTrip, closeModal } =
        useTicketHandler(tripId);
    const {
        isAnimating,
        isUnlocatedImageModalOpen,
        unlocatedImagesCount,
        confirmUnlocatedImageModal,
        closeUnlocatedImageModal,
        handleCardClick,
    } = useTicketNavigation(tripId);

    const handleShareSuccess = () => {
        setInputValue('');
        setError('');
        setIsShareModalOpen(false);
        showToast(`'${inputValue}'님께 여행 공유를 요청했습니다`);
    };

    const handleShareError = (error: unknown) => {
        if (error instanceof AxiosError && error.response?.data) {
            const { status } = error.response.data;
            setError(
                status === 404 ? '해당 닉네임의 사용자를 찾을 수 없습니다' : `이미 '${inputValue}'와 공유된 여행입니다`,
            );
        }
    };

    const handleTripShare = async () => {
        if (!inputValue.trim()) {
            setError('닉네임을 입력해주세요.');
            return;
        }

        try {
            setIsLoading(true);

            const searchResult = await shareAPI.searchUsers(inputValue);

            const recipientId = searchResult.data.userId;
            await shareAPI.createShareRequest(tripId, recipientId);

            handleShareSuccess();
        } catch (error) {
            handleShareError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div css={ticketContainer}>
            <article css={ticketStyle} onClick={handleCardClick}>
                <section css={leftSection}>
                    <header css={leftTopSection}>
                        <div>
                            <h3 css={labelStyle}>PASSENGER</h3>
                            <p css={valueStyle}>{userNickname}</p>
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

                <aside css={[rightSection, isAnimating && animateRight]}>
                    <header css={rightTopSection}>
                        <h3 css={labelStyle}>FLIGHT</h3>
                        <p css={valueStyle}>TYCHE AIR</p>
                    </header>
                    <div css={rightContent}>
                        <img css={imageStyle} src={characterImg} alt='캐릭터' />
                        <p css={textStyle}>Click Ticket</p>
                    </div>
                </aside>
            </article>

            <footer css={buttonGroup}>
                <button css={buttonStyle} onClick={() => setIsShareModalOpen(true)}>
                    <Bell size={16} /> 티켓 공유
                </button>
                <button css={buttonStyle} onClick={handleImageUpload}>
                    <ImagePlus size={16} /> 사진 관리
                </button>
                <button css={buttonStyle} onClick={handleTripEdit}>
                    <FaPencilAlt size={12} /> 여행 수정
                </button>
                <button css={buttonStyle} onClick={handleTripDelete}>
                    <FaTrashAlt size={12} /> 여행 삭제
                </button>
            </footer>
            {isModalOpen && (
                <ConfirmModal
                    title='보더패스를 삭제하시겠습니까?'
                    description='보더패스를 삭제하면 해당 여행의 정보와 사진들은 다시 복구할 수 없어요. 그래도 삭제하시겠습니까?'
                    confirmText='삭제'
                    cancelText='취소'
                    confirmModal={deleteTrip}
                    closeModal={closeModal}
                />
            )}
            {isUnlocatedImageModalOpen && (
                <ConfirmModal
                    title={`위치정보 없는 사진이 ${unlocatedImagesCount} 장 있어요!`}
                    description='사진에 직접 위치를 등록할 수 있어요. 지금 등록하시겠습니까? 등록은 언제든지 할 수 있어요'
                    confirmText='위치 등록하기'
                    cancelText='다음에'
                    confirmModal={confirmUnlocatedImageModal}
                    closeModal={closeUnlocatedImageModal}
                />
            )}
            {isShareModalOpen && (
                <InputModal
                    error={error}
                    value={inputValue}
                    onChange={(inputValue) => setInputValue(inputValue)}
                    title='여행 공유하기'
                    description='함께 여행을 관리할 여행자를 입력해주세요'
                    confirmText='공유하기'
                    cancelText='나가기'
                    confirmModal={handleTripShare}
                    closeModal={() => {
                        setIsShareModalOpen(false);
                        setInputValue('');
                        setError('');
                    }}
                    disabled={isLoading}
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

const leftTopSection = css`
    height: 48px;
    display: flex;
    justify-content: space-between;
    border-radius: 10px 0 0 0;
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
    height: 100%;
    background: ${theme.COLORS.BACKGROUND.WHITE};
    border-radius: 0 10px 10px 0;
    box-shadow:
        6px 6px 8px rgba(0, 0, 0, 0.1),
        1px 1px 3px rgba(0, 0, 0, 0.08);
`;

const rightTopSection = css`
    height: 48px;
    padding: 10px 12px;
    background-color: ${theme.COLORS.PRIMARY};
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
    width: 48px;
`;

const textStyle = css`
    font-size: ${theme.FONT_SIZES.MD};
    font-weight: 600;
    color: ${theme.COLORS.TEXT.DESCRIPTION};
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
    padding: 12px 8px 0 8px;
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
