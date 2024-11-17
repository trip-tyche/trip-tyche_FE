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
import { formatDateToDot } from '@/utils/date';

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
                            <p css={valueStyle}>{formatDateToDot(startDate)}</p>
                        </div>
                        <div>
                            <h3 css={labelStyle}>DATE</h3>
                            <p css={valueStyle}>{formatDateToDot(endDate)}</p>
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

            <footer css={buttonGroup}>
                <button css={buttonStyle} onClick={handleImageUpload}>
                    <ImagePlus size={16} /> 사진 추가
                </button>
                <button css={buttonStyle} onClick={handleTripEdit}>
                    <FaPencilAlt size={12} /> 여행 수정
                </button>
                <button css={buttonStyle} onClick={handleTripDelete}>
                    <FaTrashAlt size={12} /> 여행 삭제
                </button>
            </footer>
        </div>
    );
};

const ticketContainer = css`
    margin-bottom: 12px;
`;

const ticketStyle = css`
    width: 100%;
    max-width: 428px;
    position: relative;
    display: flex;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
`;

const leftSection = css`
    width: 75%;
    background: ${theme.colors.modalBg};
    border-right: 1px solid ${theme.colors.borderColor};
    border-radius: 10px 0 0 10px;
    box-shadow:
        -6px 6px 8px rgba(0, 0, 0, 0.1),
        -1px 1px 3px rgba(0, 0, 0, 0.08);
`;

const leftTopSection = css`
    display: flex;
    justify-content: space-between;
    border-radius: 10px 0 0 0;
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
    font-size: ${theme.fontSizes.small_12};
    font-weight: bold;
`;

const titleValueStyle = css`
    font-weight: bold;
`;

const flagStyle = css`
    display: flex;
    align-items: center;
    margin-right: 4px;
    font-size: ${theme.fontSizes.xlarge_18};
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

const rightSection = css`
    width: 25%;
    background-color: ${theme.colors.white};
    border-radius: 0 10px 10px 0;
    box-shadow:
        6px 6px 8px rgba(0, 0, 0, 0.1),
        1px 1px 3px rgba(0, 0, 0, 0.08);
`;

const rightTopSection = css`
    padding: 10px 12px;
    background-color: ${theme.colors.primary};
    border-radius: 0 10px 0 0;
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
    border-radius: 0 0 10px 0;
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
    animation: ${slideRight} 0.8s forwards;
`;

const buttonGroup = css`
    display: flex;
    justify-content: space-between;
    padding: 12px 18px 8px 18px;
`;

const buttonStyle = css`
    display: flex;
    align-items: center;
    padding: 6px 8px;
    border: none;
    border-radius: 4px;
    font-size: ${theme.fontSizes.small_12};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    gap: 4px;
    background: transparent;
    color: ${theme.colors.black};
`;

export default TripTicket;
