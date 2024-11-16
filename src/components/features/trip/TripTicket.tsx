import { css, keyframes } from '@emotion/react';
import { ImagePlus } from 'lucide-react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { IoAirplaneSharp } from 'react-icons/io5';

import characterImg from '@/assets/images/character-1.png';
import ConfirmModal from '@/components/features/guide/ConfirmModal';
import { useTicketHandler } from '@/hooks/useTicketHandler';
import { useTicketNavigation } from '@/hooks/useTicketNavigation';
import theme from '@/styles/theme';
import { FormattedTripDate } from '@/types/trip';

interface TripTicketProps {
    trip: FormattedTripDate;
    userNickname: string;
}

const TripTicket = ({ trip, userNickname }: TripTicketProps) => {
    const { tripId, tripTitle, country, startDate, endDate, hashtags } = trip;

    const { isModalOpen, handleImageUpload, handleTripEdit, handleTripDelete, deleteTrip, closeModal } =
        useTicketHandler(tripId);
    const { isAnimating, handleCardClick } = useTicketNavigation(tripId, isModalOpen);

    return (
        <article css={ticketContainer} onClick={handleCardClick}>
            <section css={leftContent}>
                <header css={leftTopSection}>
                    <div>
                        <h3 css={labelStyle}>PASSENGER</h3>
                        <p css={valueStyle}>{userNickname}</p>
                    </div>
                    <div>
                        <h3 css={labelStyle}>DATE</h3>
                        <p css={valueStyle}>{startDate}</p>
                    </div>
                    <div>
                        <h3 css={labelStyle}>DATE</h3>
                        <p css={valueStyle}>{endDate}</p>
                    </div>
                </header>

                <main css={contentContainer}>
                    <div css={citiesStyle}>
                        <span>INCHEON</span>
                        <IoAirplaneSharp />
                        <span>{country.substring(4)}</span>
                    </div>
                    <h2 css={titleStyle}>{tripTitle}</h2>
                    <div css={hashtagGroup}>
                        {hashtags.map((tag, index) => (
                            <span key={index} css={hashtagStyle}>
                                # {tag}
                            </span>
                        ))}
                    </div>
                </main>

                <div css={buttonGroup}>
                    <button css={buttonStyle} onClick={handleImageUpload}>
                        <ImagePlus size={16} /> 사진등록
                    </button>
                    <button css={buttonStyle} onClick={handleTripEdit}>
                        <FaPencilAlt size={12} /> 여행수정
                    </button>
                    <button css={buttonStyle} onClick={handleTripDelete}>
                        <FaTrashAlt size={12} /> 여행삭제
                    </button>
                </div>
            </section>

            <aside css={[rightSection, isAnimating && animateRight]}>
                <header css={rightTopSection}>
                    <h3 css={labelStyle}>FLIGHT</h3>
                    <p css={valueStyle}>TYCHE AIR</p>
                </header>
                <div css={rightContent}>
                    <img css={imageStyle} src={characterImg} alt='캐릭터' />
                    <p css={textStyle}>Click Ticket!</p>
                </div>
            </aside>

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
        </article>
    );
};

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
    box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.1),
        0 1px 3px rgba(0, 0, 0, 0.08);
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
    padding: 12px 12px 10px 12px;
`;

const citiesStyle = css`
    display: flex;
    justify-content: space-between;
    font-size: ${theme.fontSizes.xxlarge_20};
    font-weight: bold;
`;

const titleStyle = css`
    margin: 24px 0;
    font-weight: bold;
`;

const hashtagGroup = css`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
`;

const hashtagStyle = css`
    background-color: ${theme.colors.white};
    color: ${theme.colors.black};
    padding: 5px 10px;
    border-radius: 15px;
    font-size: ${theme.fontSizes.small_12};
`;

const buttonGroup = css`
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    border-top: 1px solid ${theme.colors.borderColor};
`;

const buttonStyle = css`
    display: flex;
    align-items: center;
    padding: 6px 8px;
    border: none;
    border-radius: 4px;
    font-size: ${theme.fontSizes.small_12};
    cursor: pointer;
    transition: all 0.3s ease;
    gap: 4px;
    background-color: ${theme.colors.white};
    color: ${theme.colors.black};
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
    gap: 28px;
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

const slideRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
      transform: translateX(100%);
    }
    `;

const animateRight = css`
    animation: ${slideRight} 1s forwards;
`;

export default TripTicket;
