import { useState } from 'react';

import { css } from '@emotion/react';
import { Search, X, Send, Touchpad } from 'lucide-react';

import { useTripShare } from '@/domains/share/hooks/useTripShare';
import Modal from '@/shared/components/common/Modal';
import { COLORS } from '@/shared/constants/theme';
import { useToastStore } from '@/shared/stores/useToastStore';

export interface ShareModalProps {
    tripKey: string;
    tripTitle: string;
    startDate: string;
    endDate: string;
    onClose: () => void;
}

const ShareModal = ({ tripKey, tripTitle, onClose, startDate, endDate }: ShareModalProps) => {
    const [inputValue, setInputValue] = useState('');

    const { showToast } = useToastStore.getState();
    const { isSharing, error, shareTrip, clearError } = useTripShare(inputValue, tripKey!, onShareSuccess);

    function onShareSuccess() {
        onClose();
        showToast(`'${inputValue}'님께 여행 공유를 요청했습니다`);
    }

    const closeModal = () => {
        onClose?.();
        setInputValue('');
        clearError();
    };

    const disabled = isSharing || inputValue.trim().length === 0;

    return (
        <Modal closeModal={closeModal}>
            <h2 css={titleStyle}>티켓 공유하기</h2>

            <div css={ticketPreviewStyle}>
                <div css={iconContainerStyle}>
                    <Touchpad color={COLORS.PRIMARY} />
                </div>
                <div>
                    <p css={ticketTitleStyle}>{tripTitle}</p>
                    <p css={ticketDatesStyle}>{`${startDate} ~ ${endDate}`}</p>
                </div>
            </div>

            <p css={descriptionStyle}>
                함께 여행 티켓을 관리할 친구를 추가해 보세요!
                <br />
                친구에게 초대 알림이 전송됩니다
            </p>

            <div css={searchContainerStyle}>
                <div css={searchIconStyle}>
                    <Search size={20} color='#9CA3AF' />
                </div>
                <input
                    type='text'
                    placeholder={'친구 닉네임 검색'}
                    css={searchInputStyle}
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                />
            </div>

            {error && <p css={errorMessageStyle}>{error}</p>}

            <div css={buttonsContainerStyle}>
                <button css={cancelButtonStyle} onClick={closeModal}>
                    취소
                </button>
                <button css={confirmButtonStyle(!disabled)} disabled={disabled} onClick={shareTrip}>
                    <Send size={16} css={sendIconStyle} />
                    <span>공유하기</span>
                </button>
            </div>
        </Modal>
    );
};

const titleStyle = css`
    font-size: 18px;
    font-weight: 600;
    color: ${COLORS.TEXT.BLACK};
    margin-top: 8px;
    margin-bottom: 20px;
`;

const ticketPreviewStyle = css`
    width: 100%;
    background-color: #eff6ff;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
`;

const iconContainerStyle = css`
    width: 48px;
    height: 48px;
    background-color: #dbeafe;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
`;

const ticketTitleStyle = css`
    font-size: 14px;
    font-weight: 500;
    color: ${COLORS.TEXT.BLACK};
    margin: 0;
    margin-bottom: 4px;
`;

const ticketDatesStyle = css`
    font-size: 12px;
    color: #6b7280;
    margin: 0;
`;

const descriptionStyle = css`
    width: 100%;
    text-align: center;
    margin: 16px 0;
    font-size: 14px;
    color: #374151;
    line-height: 1.4;
`;

const searchContainerStyle = css`
    width: 100%;
    padding: 0 16px;
    margin-bottom: 16px;
    position: relative;
`;

const searchIconStyle = css`
    position: absolute;
    left: 28px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
`;

const searchInputStyle = css`
    width: 100%;
    padding: 10px 16px 10px 40px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;

    &:focus {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    &::placeholder {
        color: #9ca3af;
    }
`;

const errorMessageStyle = css`
    margin: 0 16px 16px;
    padding: 8px 12px;
    background-color: #fef2f2;
    border-radius: 8px;
    color: ${COLORS.TEXT.ERROR};
    font-size: 14px;
`;

const buttonsContainerStyle = css`
    width: 100%;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 12px;
`;

const cancelButtonStyle = css`
    flex: 1;
    height: 48px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background-color: white;
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: #f3f4f6;
    }
`;

const confirmButtonStyle = (isActive: boolean) => css`
    flex: 1;
    height: 48px;
    padding: 10px;
    border-radius: 8px;
    border: none;
    background-color: ${isActive ? COLORS.PRIMARY : '#E5E7EB'};
    color: ${isActive ? 'white' : '#9CA3AF'};
    font-size: 14px;
    font-weight: 500;
    cursor: ${isActive ? 'pointer' : 'not-allowed'};
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: ${isActive ? COLORS.PRIMARY_HOVER : '#E5E7EB'};
    }
`;

const sendIconStyle = css`
    margin-right: 8px;
`;

export default ShareModal;
